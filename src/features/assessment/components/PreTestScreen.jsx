/**
 * PreTestScreen - Combined privacy + camera preview + room scan with S3 video upload
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { THEME_CLASSES } from '../../../theme';
import { S3Uploader } from '../services/s3Uploader';

const AREAS = [
  { id: 'desk', label: 'Desk surface', jobDescription: 'Show your desk/work area' },
  { id: 'left', label: 'Left side', jobDescription: 'Pan to your left' },
  { id: 'right', label: 'Right side', jobDescription: 'Pan to your right' },
];

export default function PreTestScreen({ state }) {
  const [cameraReady, setCameraReady] = useState(false);
  const [completedAreas, setCompletedAreas] = useState({});
  const [recordingArea, setRecordingArea] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const uploaderRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (mounted && videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      })
      .catch(() => setCameraReady(false));
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Cleanup uploader on unmount
  useEffect(() => {
    return () => {
      if (uploaderRef.current) {
        uploaderRef.current.abort().catch(() => {});
      }
    };
  }, []);

  const handleStartRecording = useCallback(async (areaId) => {
    if (!streamRef.current || recordingArea) return;
    setRecordingArea(areaId);
    try {
      const uploader = new S3Uploader({ type: 'envScan' });
      uploaderRef.current = uploader;
      await uploader.startRecording(streamRef.current, { label: areaId });
    } catch (err) {
      console.warn('Failed to start env scan recording:', err);
      // Still allow marking done without video
      setCompletedAreas((prev) => ({ ...prev, [areaId]: { label: areaId, s3Location: '', durationMs: 0 } }));
      setRecordingArea(null);
    }
  }, [recordingArea]);

  const handleStopRecording = useCallback(async (areaId) => {
    if (!uploaderRef.current) {
      setRecordingArea(null);
      return;
    }
    try {
      const { s3Location } = await uploaderRef.current.stopAndUpload();
      setCompletedAreas((prev) => ({
        ...prev,
        [areaId]: {
          label: areaId,
          s3Location: s3Location || '',
          durationMs: 5000,
          recordedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.warn('Env scan upload failed:', err);
      setCompletedAreas((prev) => ({ ...prev, [areaId]: { label: areaId, s3Location: '', durationMs: 0 } }));
    } finally {
      uploaderRef.current = null;
      setRecordingArea(null);
    }
  }, []);

  const handleAccept = () => {
    setSubmitting(true);
    const envScanData = Object.values(completedAreas).map((area) => ({
      label: area.label,
      s3Location: area.s3Location || '',
      durationMs: area.durationMs || 0,
      recordedAt: area.recordedAt || new Date().toISOString(),
    }));
    state.handlePrivacyAccept(envScanData);
  };

  const completedCount = Object.keys(completedAreas).length;

  return (
    <div className={THEME_CLASSES.cards + ' p-6'}>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Pre-Assessment Check</h2>
      <p className="text-slate-600 mb-4">
        By continuing, you agree to our assessment terms. Your camera will be used for proctoring during the test.
        Ensure you are in a well-lit, quiet environment.
      </p>
      <div className="mb-6">
        <div className="aspect-video max-w-md bg-slate-200 rounded-lg overflow-hidden relative">
          <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`} />
          {!cameraReady && (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Camera preview unavailable
            </div>
          )}
          {recordingArea && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Recording
            </div>
          )}
        </div>
      </div>

      {/* Room scan */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Environment Scan</h3>
        <p className="text-slate-500 text-sm mb-3">
          Record each area of your room using your camera. This helps ensure test integrity.
        </p>
        <div className="space-y-3">
          {AREAS.map((area) => {
            const isDone = !!completedAreas[area.id];
            const isRecording = recordingArea === area.id;
            return (
              <div
                key={area.id}
                className={`p-3 rounded-lg border ${
                  isDone ? 'border-green-500 bg-green-50' : isRecording ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-sm">{area.label}</span>
                    <p className="text-xs text-slate-500">{area.jobDescription}</p>
                  </div>
                  {isDone ? (
                    <span className="text-green-600 text-sm font-medium">Done</span>
                  ) : isRecording ? (
                    <button
                      onClick={() => handleStopRecording(area.id)}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartRecording(area.id)}
                      disabled={!!recordingArea}
                      className={`px-3 py-1 rounded text-sm ${
                        recordingArea ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : THEME_CLASSES.buttons.secondary
                      }`}
                    >
                      Record
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleAccept}
        disabled={submitting}
        className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
      >
        {submitting ? 'Starting...' : 'I Accept & Continue'}
      </button>
    </div>
  );
}
