/**
 * AUREN Store Frame Loader
 * Efficient, non-blocking image sequence preloader with prioritized queue,
 * nearest-frame fallback, and auto-format detection.
 */

export interface FrameUrlOptions {
  framePath?: string;
  prefix?: string;
  padDigits?: number;
  extension?: string;
}

export interface PreloadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface FramePreloaderOptions extends FrameUrlOptions {
  totalFrames: number;
  initialBuffer?: number;
  concurrency?: number;
  onProgress?: (progress: PreloadProgress) => void;
  onInitialReady?: () => void;
  onComplete?: () => void;
}

export interface FramePreloaderController {
  images: (HTMLImageElement | null)[];
  totalFrames: number;
  isInitialReady: boolean;
  isComplete: boolean;
  loadedCount: number;
  getFrameUrl: (index: number) => string;
  getImage: (index: number) => HTMLImageElement | null;
  getClosestLoadedImage: (index: number) => HTMLImageElement | null;
  setPriorityIndex: (index: number) => void;
  destroy: () => void;
}

/**
 * Builds the URL for a frame given a 1-based or 0-based index.
 * Standardizes to 1-based index for file names (1 .. totalFrames).
 */
export function getFrameUrl(
  frameIndex1Based: number,
  options: FrameUrlOptions = {}
): string {
  const {
    framePath = '/auren-store-frames/',
    prefix = '',
    padDigits = 5,
    extension = 'webp',
  } = options;

  const basePath = framePath.endsWith('/') ? framePath : `${framePath}/`;
  const paddedNumber = String(frameIndex1Based).padStart(padDigits, '0');
  const cleanExt = extension.replace(/^\./, '');

  return `${basePath}${prefix}${paddedNumber}.${cleanExt}`;
}

/**
 * Creates an intelligent frame preloader with priority loading,
 * concurrency queue, and memory management.
 */
export function createFramePreloader(
  options: FramePreloaderOptions
): FramePreloaderController {
  const {
    totalFrames,
    initialBuffer = Math.min(12, Math.max(3, Math.floor(totalFrames * 0.05))),
    concurrency = 6,
    onProgress,
    onInitialReady,
    onComplete,
    ...urlOptions
  } = options;

  // Active options can be updated if fallback detection triggers
  const activeOptions: FrameUrlOptions = {
    framePath: urlOptions.framePath ?? '/auren-store-frames/',
    prefix: urlOptions.prefix ?? '',
    padDigits: urlOptions.padDigits ?? 5,
    extension: urlOptions.extension ?? 'webp',
  };

  const images: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
  const loadingSet = new Set<number>();
  let loadedCount = 0;
  let isInitialReady = false;
  let isComplete = false;
  let isDestroyed = false;
  let priorityIndex = 0;

  // Track pending frame indices (0 to totalFrames - 1)
  const pendingIndices: number[] = Array.from({ length: totalFrames }, (_, i) => i);

  function notifyProgress() {
    const percent = totalFrames > 0 ? Math.round((loadedCount / totalFrames) * 100) : 100;
    onProgress?.({ loaded: loadedCount, total: totalFrames, percent });

    if (!isInitialReady && (images[0] !== null || loadedCount >= initialBuffer)) {
      isInitialReady = true;
      onInitialReady?.();
    }

    if (loadedCount >= totalFrames && !isComplete) {
      isComplete = true;
      onComplete?.();
    }
  }

  function resolveUrl(index0Based: number): string {
    return getFrameUrl(index0Based + 1, activeOptions);
  }

  /**
   * Safe image loader with candidate pattern fallback on frame 1
   */
  function loadImage(index0Based: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (isDestroyed) {
        return reject(new Error('Preloader destroyed'));
      }

      const img = new Image();
      const primaryUrl = resolveUrl(index0Based);

      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        if (isDestroyed) return;
        images[index0Based] = img;
        loadedCount++;
        loadingSet.delete(index0Based);
        notifyProgress();
        resolve(img);
      };

      img.onerror = () => {
        cleanup();
        if (isDestroyed) return;

        // If frame 0 (first frame) fails with default options, attempt pattern auto-detection
        if (index0Based === 0 && activeOptions.prefix === '' && activeOptions.padDigits === 5) {
          const candidatePatterns: Array<{ prefix: string; padDigits: number }> = [
            { prefix: 'frame_', padDigits: 4 }, // frame_0001.jpg
            { prefix: 'frame_', padDigits: 5 }, // frame_00001.jpg
            { prefix: '', padDigits: 4 },        // 0001.jpg
          ];

          let patternIdx = 0;
          const tryNextCandidate = () => {
            if (patternIdx >= candidatePatterns.length) {
              loadingSet.delete(index0Based);
              return reject(new Error(`Failed to load frame 0 from ${primaryUrl}`));
            }
            const candidate = candidatePatterns[patternIdx++];
            const candidateUrl = getFrameUrl(1, { ...activeOptions, ...candidate });
            const testImg = new Image();
            testImg.onload = () => {
              testImg.onload = null;
              testImg.onerror = null;
              if (isDestroyed) return;
              // Adopt the detected pattern for all remaining frames!
              activeOptions.prefix = candidate.prefix;
              activeOptions.padDigits = candidate.padDigits;
              images[index0Based] = testImg;
              loadedCount++;
              loadingSet.delete(index0Based);
              notifyProgress();
              resolve(testImg);
            };
            testImg.onerror = () => {
              testImg.onload = null;
              testImg.onerror = null;
              tryNextCandidate();
            };
            testImg.src = candidateUrl;
          };

          tryNextCandidate();
          return;
        }

        loadingSet.delete(index0Based);
        // Do not reject hard - resolve null so pumpQueue continues
        resolve(img);
      };

      img.src = primaryUrl;
    });
  }

  function pumpQueue() {
    if (isDestroyed || pendingIndices.length === 0) return;

    while (loadingSet.size < concurrency && pendingIndices.length > 0) {
      // Sort pending by proximity to current priorityIndex
      pendingIndices.sort(
        (a, b) => Math.abs(a - priorityIndex) - Math.abs(b - priorityIndex)
      );

      const nextIndex = pendingIndices.shift();
      if (nextIndex === undefined) break;

      if (images[nextIndex] !== null) continue;

      loadingSet.add(nextIndex);
      loadImage(nextIndex).finally(() => {
        pumpQueue();
      });
    }
  }

  // Kickstart priority 1: frame 0 immediately
  const frame0Index = pendingIndices.indexOf(0);
  if (frame0Index > -1) {
    pendingIndices.splice(frame0Index, 1);
    loadingSet.add(0);
    loadImage(0).finally(() => {
      pumpQueue();
    });
  }

  // Start concurrent loader for next batch
  pumpQueue();

  return {
    images,
    totalFrames,
    get isInitialReady() {
      return isInitialReady;
    },
    get isComplete() {
      return isComplete;
    },
    get loadedCount() {
      return loadedCount;
    },
    getFrameUrl: (index1Based: number) => getFrameUrl(index1Based, activeOptions),
    getImage: (index0Based: number) => {
      if (index0Based < 0 || index0Based >= totalFrames) return null;
      return images[index0Based];
    },
    getClosestLoadedImage: (targetIndex: number) => {
      if (images[targetIndex]) return images[targetIndex];

      // Search outward for the closest loaded frame to prevent blank canvas flashes
      let step = 1;
      while (targetIndex - step >= 0 || targetIndex + step < totalFrames) {
        if (targetIndex - step >= 0 && images[targetIndex - step]) {
          return images[targetIndex - step];
        }
        if (targetIndex + step < totalFrames && images[targetIndex + step]) {
          return images[targetIndex + step];
        }
        step++;
      }
      return images[0] || null;
    },
    setPriorityIndex: (index0Based: number) => {
      priorityIndex = Math.max(0, Math.min(totalFrames - 1, index0Based));
      pumpQueue();
    },
    destroy: () => {
      isDestroyed = true;
      pendingIndices.length = 0;
      loadingSet.clear();
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          images[i]!.onload = null;
          images[i]!.onerror = null;
          images[i]!.src = '';
          images[i] = null;
        }
      }
    },
  };
}
