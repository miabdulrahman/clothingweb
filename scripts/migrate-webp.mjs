// ============================================
// AUREN — WebP Asset Migration Script
// ============================================
//
// 1. Converts all JPG frames (00001.jpg - 00120.jpg) to WebP
// 2. Converts all product PNGs (mens_*.png) to WebP
// 3. Attempts upload to Supabase Storage if bucket is reachable
// 4. Reports compression metrics & status
//
// Usage: node scripts/migrate-webp.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Parse .env.local
const envPath = path.join(ROOT_DIR, '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        envVars[key] = val;
      }
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const BUCKET_NAME = 'auren-product-images';

const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

async function convertFrames() {
  console.log('\n--- 1. Converting Frames to WebP ---');
  const framesDir = path.join(ROOT_DIR, 'public', 'auren-store-frames');
  if (!fs.existsSync(framesDir)) {
    console.log(`Frames directory not found: ${framesDir}`);
    return [];
  }

  const files = fs.readdirSync(framesDir).filter(f => f.toLowerCase().endsWith('.jpg'));
  console.log(`Found ${files.length} JPG frames.`);

  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  const converted = [];

  for (const file of files) {
    const inputPath = path.join(framesDir, file);
    const outputPath = path.join(framesDir, file.replace(/\.jpg$/i, '.webp'));

    const origStat = fs.statSync(inputPath);
    totalOriginalSize += origStat.size;

    if (!fs.existsSync(outputPath)) {
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);
    }

    const newStat = fs.statSync(outputPath);
    totalWebpSize += newStat.size;
    converted.push({ file: outputPath, name: path.basename(outputPath), relative: `frames/${path.basename(outputPath)}` });
  }

  const savedPercent = (((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100).toFixed(1);
  console.log(`Frames ready:   ${converted.length}`);
  console.log(`Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP total:     ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB\n`);

  return converted;
}

async function convertProductImages() {
  console.log('--- 2. Checking Product PNGs to WebP ---');
  const imagesDir = path.join(ROOT_DIR, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    console.log(`Images directory not found: ${imagesDir}`);
    return [];
  }

  // Only convert product images (mens_*.png), preserve logos (auren_*)
  const files = fs.readdirSync(imagesDir).filter(f => f.startsWith('mens_') && f.toLowerCase().endsWith('.png'));
  console.log(`Found ${files.length} product PNG images.`);

  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  const converted = [];

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const outputPath = path.join(imagesDir, file.replace(/\.png$/i, '.webp'));

    const origStat = fs.statSync(inputPath);
    totalOriginalSize += origStat.size;

    if (!fs.existsSync(outputPath)) {
      await sharp(inputPath)
        .webp({ quality: 82, effort: 4 })
        .toFile(outputPath);
    }

    const newStat = fs.statSync(outputPath);
    totalWebpSize += newStat.size;
    converted.push({ file: outputPath, name: path.basename(outputPath), relative: `products/${path.basename(outputPath)}` });
  }

  const savedPercent = (((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100).toFixed(1);
  console.log(`Products ready: ${converted.length}`);
  console.log(`Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP total:     ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:          ${savedPercent}% bandwidth\n`);

  return converted;
}

async function uploadToSupabase(allFiles) {
  console.log('--- 3. Supabase Storage Sync ---');
  if (!supabase) {
    console.log('Supabase client not initialized (missing URL or Key). Skipping remote upload.');
    return;
  }

  console.log(`Checking bucket: "${BUCKET_NAME}"...`);
  const { data: bucketContents, error: bucketError } = await supabase.storage.from(BUCKET_NAME).list();

  if (bucketError) {
    console.warn(`Bucket "${BUCKET_NAME}" does not exist yet or is not accessible with current key:`, bucketError.message);
    console.warn(`Please run the SQL migration in Supabase Dashboard SQL Editor (see supabase/schema.sql) to create the bucket and policies.`);
    console.warn(`Once the bucket is created in Supabase, re-run this script or upload via admin dashboard.\n`);
    return;
  }

  console.log(`Bucket "${BUCKET_NAME}" verified! Syncing ${allFiles.length} files...`);
  let uploadedCount = 0;
  for (let i = 0; i < allFiles.length; i++) {
    const item = allFiles[i];
    const fileBuffer = fs.readFileSync(item.file);
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(item.relative, fileBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadErr) {
      console.error(`Failed to upload ${item.relative}:`, uploadErr.message);
    } else {
      uploadedCount++;
      if (uploadedCount % 20 === 0 || uploadedCount === allFiles.length) {
        console.log(`Uploaded ${uploadedCount}/${allFiles.length} files...`);
      }
    }
  }

  console.log(`\nSuccessfully uploaded ${uploadedCount}/${allFiles.length} files to Supabase Storage.\n`);
}

async function main() {
  console.log('====================================');
  console.log('   AUREN WebP Asset Migration');
  console.log('====================================');

  const frameFiles = await convertFrames();
  const productFiles = await convertProductImages();

  await uploadToSupabase([...productFiles, ...frameFiles]);

  console.log('====================================');
  console.log('   Migration Complete!');
  console.log('====================================');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
