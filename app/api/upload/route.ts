// ============================================
// Image Upload API Route — WebP Conversion
// ============================================
//
// Accepts JPG/PNG/WebP/GIF uploads, converts to WebP,
// and uploads the result to Supabase Storage.

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import {
  STORAGE_BUCKET_NAME,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from '@/lib/supabase/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = (formData.get('productId') as string) || 'general';

    // ── Validate presence ──────────────────────────────────────────
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      );
    }

    // ── Validate MIME type ─────────────────────────────────────────
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type "${file.type}". Accepted formats: JPG, PNG, WebP, GIF.`,
        },
        { status: 400 }
      );
    }

    // ── Validate file size ─────────────────────────────────────────
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        },
        { status: 400 }
      );
    }

    // ── Read buffer and verify it is a real image ──────────────────
    const buffer = Buffer.from(await file.arrayBuffer());

    let metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch {
      return NextResponse.json(
        { error: 'Uploaded file is not a valid image.' },
        { status: 400 }
      );
    }

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: 'Unable to read image dimensions.' },
        { status: 400 }
      );
    }

    // ── Convert to WebP ────────────────────────────────────────────
    const webpBuffer = await sharp(buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    // ── Generate unique filename ───────────────────────────────────
    const uniqueId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().split('-')[0]
        : Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    const filename = `${timestamp}-${uniqueId}.webp`;
    const storagePath = `products/${productId}/${filename}`;

    // ── Upload to Supabase Storage ─────────────────────────────────
    const supabase = await createClient();

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(storagePath, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1-year cache
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // ── Return public URL ──────────────────────────────────────────
    const {
      data: { publicUrl },
    } = supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      url: publicUrl,
      path: storagePath,
      size: webpBuffer.length,
      originalSize: file.size,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
