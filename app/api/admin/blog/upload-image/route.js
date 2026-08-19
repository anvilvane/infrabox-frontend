import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { checkAuth } from '@/lib/auth-check';

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // e.g., https://account-id.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET = process.env.R2_BUCKET_NAME || 'infrabox-blog';
// No fallback on purpose: the old default pointed at the previous company's R2 bucket,
// so a missing env var silently published uploads under their domain. Fail loudly instead.
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

/**
 * Generate a unique filename to prevent conflicts
 */
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop();
  const name = originalName.split('.').slice(0, -1).join('.');
  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `blog/${timestamp}-${randomString}-${safeName}.${ext}`;
}

/**
 * POST /api/admin/blog/upload-image
 * Upload an image to Cloudflare R2
 */
export async function POST(req) {
  try {
    // Check authentication
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000',
    });

    await s3Client.send(uploadCommand);

    // Return the public URL
    const url = `${R2_PUBLIC_URL}/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      filename,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}
