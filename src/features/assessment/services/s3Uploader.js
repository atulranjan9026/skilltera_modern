/**
 * S3 Multipart Uploader - Records video and uploads to S3 via session-upload endpoints.
 * Used for env scan and self-intro video recordings.
 *
 * Usage:
 *   const uploader = new S3Uploader({ type: 'envScan' });
 *   await uploader.startRecording(mediaStream, { label: 'desk' });
 *   const { s3Location } = await uploader.stopAndUpload();
 */
import { sessionUploadService } from './testService';

const MIN_PART_SIZE = 5 * 1024 * 1024; // 5MB minimum for S3 multipart

export class S3Uploader {
  constructor({ type = 'session', mimeType } = {}) {
    this.type = type;
    this.recorder = null;
    this.chunks = [];
    this.multipart = { uploadId: null, key: null, parts: [], partNumber: 1 };
    this.selectedMimeType = mimeType || this._detectMimeType();
  }

  _detectMimeType() {
    const types = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
    }
    return 'video/webm';
  }

  /**
   * Start recording from a MediaStream
   */
  async startRecording(stream, { label } = {}) {
    this.chunks = [];
    this.multipart = { uploadId: null, key: null, parts: [], partNumber: 1 };

    // Initiate S3 multipart upload
    const ext = this.selectedMimeType.includes('mp4') ? 'mp4' : 'webm';
    const res = await sessionUploadService.initiate({
      type: this.type,
      label,
      contentType: this.selectedMimeType,
      extension: ext,
    });
    this.multipart.uploadId = res.uploadId;
    this.multipart.key = res.key;

    // Start MediaRecorder
    this.recorder = new MediaRecorder(stream, {
      mimeType: this.selectedMimeType,
      videoBitsPerSecond: 1_000_000,
    });
    this.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
    this.recorder.start(1000); // 1-second chunks
  }

  /**
   * Stop recording and upload all chunks to S3
   * Returns { s3Location, key }
   */
  async stopAndUpload() {
    if (!this.recorder || this.recorder.state === 'inactive') {
      return { s3Location: '', key: '' };
    }

    // Stop recorder and wait for final data
    await new Promise((resolve) => {
      this.recorder.onstop = resolve;
      this.recorder.stop();
    });

    if (this.chunks.length === 0 || !this.multipart.uploadId) {
      return { s3Location: '', key: '' };
    }

    // Combine chunks into a single blob, then slice into S3 parts
    const fullBlob = new Blob(this.chunks, { type: this.selectedMimeType });
    const totalSize = fullBlob.size;

    if (totalSize === 0) {
      return { s3Location: '', key: '' };
    }

    // Upload parts
    let offset = 0;
    while (offset < totalSize) {
      const end = Math.min(offset + Math.max(MIN_PART_SIZE, totalSize), totalSize);
      const partBlob = fullBlob.slice(offset, end);

      // Get presigned URL
      const { url } = await sessionUploadService.sign({
        uploadId: this.multipart.uploadId,
        key: this.multipart.key,
        partNumber: String(this.multipart.partNumber),
      });

      // Upload directly to S3
      const response = await fetch(url, {
        method: 'PUT',
        body: partBlob,
        headers: { 'Content-Type': this.selectedMimeType },
      });

      const etag = response.headers.get('ETag');
      this.multipart.parts.push({
        ETag: etag,
        PartNumber: this.multipart.partNumber,
      });
      this.multipart.partNumber++;
      offset = end;
    }

    // Complete multipart upload
    const result = await sessionUploadService.complete({
      uploadId: this.multipart.uploadId,
      key: this.multipart.key,
      parts: this.multipart.parts,
    });

    this.chunks = [];
    return {
      s3Location: result.location || `https://s3.amazonaws.com/${result.bucket}/${result.key}`,
      key: result.key,
    };
  }

  /**
   * Abort an in-progress upload
   */
  async abort() {
    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
    if (this.multipart.uploadId && this.multipart.key) {
      try {
        await sessionUploadService.abort({
          uploadId: this.multipart.uploadId,
          key: this.multipart.key,
        });
      } catch (e) {
        console.warn('S3 abort failed:', e);
      }
    }
    this.chunks = [];
  }
}
