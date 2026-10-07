// ============================================
// Supabase Storage Utility for Product Images
// ============================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const BUCKET_NAME = 'auren-product-images';

/**
 * Get the Supabase Storage public URL for a given file path within the bucket
 */
export function getStoragePublicUrl(path: string): string {
  if (!SUPABASE_URL) return '';
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

/**
 * Get Supabase Storage URL for a product image
 */
export function getProductImageUrl(filename: string): string {
  return getStoragePublicUrl(`products/${filename}`);
}

/**
 * Get Supabase Storage URL for a frame image
 */
export function getFrameImageUrl(frameNumber: number, padDigits = 5): string {
  const paddedNumber = String(frameNumber).padStart(padDigits, '0');
  return getStoragePublicUrl(`frames/${paddedNumber}.webp`);
}

/**
 * Get the base URL for the frames directory.
 * We serve frames directly from the local public folder for better performance and smoother animations.
 */
export function getFramesBasePath(): string {
  return '/auren-store-frames/';
}

/**
 * Get the base URL for the mobile frames directory.
 * Portrait frames (720x1280) optimized for mobile viewports.
 */
export function getMobileFramesBasePath(): string {
  return '/mobile-store-frames/';
}

/**
 * Resolve a product image path. Returns the Supabase WebP URL if Supabase is
 * configured, otherwise returns the original local path as a fallback.
 *
 * @param localName  Base image name without extension, e.g. 'mens_oversized_tee'
 * @param localExt   Local file extension for fallback, e.g. '.png'
 */
export function resolveProductImage(localName: string, localExt = '.png'): string {
  if (SUPABASE_URL && SUPABASE_URL !== 'https://your-project-id.supabase.co') {
    return getProductImageUrl(`${localName}.webp`);
  }
  return `/images/${localName}${localExt}`;
}

/**
 * Check if a URL is external (Supabase/CDN)
 */
export function isExternalImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/** Bucket name constant */
export const STORAGE_BUCKET_NAME = BUCKET_NAME;

/** Maximum upload file size: 5 MB */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Accepted MIME types for image uploads */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
