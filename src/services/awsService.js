import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// Configure AWS with backend environment variables
const region = import.meta.env.VITE_AWS_BUCKET_REGION || import.meta.env.AWS_BUCKET_REGION || 'us-west-2';
const bucketName = import.meta.env.VITE_AWS_S3_BUCKET || import.meta.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: import.meta.env.VITE_SKILLTERA_AWS_ACCESS_KEY || import.meta.env.SKILLTERA_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_SKILLTERA_AWS_SECRET_KEY || import.meta.env.SKILLTERA_AWS_SECRET_KEY,
  },
});

const S3_BUCKET = bucketName;

/**
 * Upload file to AWS S3
 * @param {File} file - The file to upload
 * @param {string} folder - The S3 folder (e.g., 'resumes', 'avatars')
 * @returns {Promise<Object>} - Upload response with URL and file info
 */
export const uploadFileToS3 = async (file, folder = 'resumes') => {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const s3Key = `${folder}/${fileName}`;

    // Convert File to ArrayBuffer for AWS SDK v3
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to S3 using AWS SDK v3
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: uint8Array,
      ContentType: file.type,
      ACL: 'public-read',
    });

    const uploadResult = await s3Client.send(command);

    // Construct the public URL
    const publicUrl = `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${s3Key}`;

    // Return the file information
    return {
      success: true,
      url: publicUrl,
      publicId: `local:${fileName}`,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
      s3Key: s3Key,
    };
  } catch (error) {
    console.error('AWS S3 upload error:', error);
    throw new Error(`Failed to upload file to AWS: ${error.message}`);
  }
};

/**
 * Delete file from AWS S3
 * @param {string} s3Key - The S3 key of the file to delete
 * @returns {Promise<Object>} - Delete response
 */
export const deleteFileFromS3 = async (s3Key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
    });

    await s3Client.send(command);

    return {
      success: true,
      message: 'File deleted successfully from S3',
    };
  } catch (error) {
    console.error('AWS S3 delete error:', error);
    throw new Error(`Failed to delete file from AWS: ${error.message}`);
  }
};
