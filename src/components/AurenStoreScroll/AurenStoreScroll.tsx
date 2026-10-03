'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  createFramePreloader,
  FramePreloaderController,
  FrameUrlOptions,
} from './frameLoader';
import './AurenStoreScroll.css';

export interface AurenStoreScrollProps extends FrameUrlOptions {
  /**
   * Total number of frames in the sequence (default: 240)
   */
  totalFrames?: number;
  /**
   * Path to the folder containing frames (default: '/auren-store-frames/')
   */
  framePath?: string;
  /**
   * Optional prefix before the zero-padded index (e.g. 'frame_' or '') (default: '')
   */
  prefix?: string;
  /**
   * Digits to zero-pad (e.g. 5 for '00001', 4 for '0001') (default: 5)
   */
  padDigits?: number;
  /**
   * Image format extension without leading dot (default: 'webp')
   */
  extension?: string;
  /**
   * Total scroll height of the pin container (default: '600vh')
   */
  scrollDistance?: string;
  /**
   * Canvas image scaling behavior: 'cover' (fills screen) or 'contain' (default: 'cover')
   */
  fitMode?: 'cover' | 'contain';
  /**
   * Additional container CSS classes
   */
  className?: string;
  /**
   * Optional callback when the active frame changes
   */
  onFrameChange?: (frameIndex: number, progress: number) => void;
}

export const TOTAL_FRAMES_DEFAULT = 120;

export default function AurenStoreScroll({
  totalFrames = TOTAL_FRAMES_DEFAULT,
  framePath = '/auren-store-frames/',
  prefix = '',
  padDigits = 5,
  extension = 'webp',
  scrollDistance = '500vh',
  fitMode = 'cover',
  className = '',
  onFrameChange,
}: AurenStoreScrollProps) {
  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay Refs (Direct DOM manipulation to eliminate React re-render overhead during 120fps scrolling)
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const midBadgeRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);
  const frameCounterRef = useRef<HTMLDivElement>(null);
  const exitFadeRef = useRef<HTMLDivElement>(null);

  // Scroll & Animation Loop State
  const preloaderRef = useRef<FramePreloaderController | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);

  // React State (Only for initial preloader UI to avoid scroll performance bottlenecks)
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  /**
   * High performance canvas drawer with aspect-ratio preservation
   */
  const drawImageToCanvas = useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!cw || !ch || !iw || !ih) return;

      const scale =
        fitMode === 'contain'
          ? Math.min(cw / iw, ch / ih)
          : Math.max(cw / iw, ch / ih);

      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) * 0.5;
      const dy = (ch - dh) * 0.5;

      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    },
    [fitMode]
  );

  /**
   * Resizes canvas to match viewport and display devicePixelRatio
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;

    const rect = sticky.getBoundingClientRect();
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Re-draw current frame after resize
      const preloader = preloaderRef.current;
      if (preloader) {
        const activeIdx = Math.max(0, currentFrameRef.current);
        const img = preloader.getClosestLoadedImage(activeIdx);
        if (img) {
          drawImageToCanvas(img);
        }
      }
    }
  }, [drawImageToCanvas]);

  /**
   * Smoothly updates text overlay opacities and transforms using direct DOM properties
   */
  const updateOverlays = useCallback(
    (progress: number, frameIndex: number) => {
      // 1. Intro Overlay (0% -> ~25%)
      if (introOverlayRef.current) {
        if (progress <= 0.12) {
          introOverlayRef.current.style.display = 'flex';
          introOverlayRef.current.style.opacity = '1';
          introOverlayRef.current.style.transform = `translateY(-${progress * 40}px)`;
        } else if (progress <= 0.28) {
          const fadeOutProgress = (progress - 0.12) / 0.16;
          introOverlayRef.current.style.display = 'flex';
          introOverlayRef.current.style.opacity = String(Math.max(0, 1 - fadeOutProgress));
          introOverlayRef.current.style.transform = `translateY(-${progress * 40}px)`;
        } else {
          introOverlayRef.current.style.display = 'none';
        }
      }

      // 2. Scroll Prompt Hint (0% -> ~15%)
      if (scrollHintRef.current) {
        if (progress <= 0.05) {
          scrollHintRef.current.style.opacity = '1';
          scrollHintRef.current.style.display = 'block';
        } else if (progress <= 0.16) {
          const fade = 1 - (progress - 0.05) / 0.11;
          scrollHintRef.current.style.opacity = String(Math.max(0, fade));
          scrollHintRef.current.style.display = 'block';
        } else {
          scrollHintRef.current.style.display = 'none';
        }
      }

      // 3. Midway Milestone Badge (Doors Open / Step Inside: 36% -> 52%)
      if (midBadgeRef.current) {
        if (progress >= 0.36 && progress <= 0.52) {
          let alpha = 1;
          if (progress < 0.41) {
            alpha = (progress - 0.36) / 0.05;
          } else if (progress > 0.47) {
            alpha = 1 - (progress - 0.47) / 0.05;
          }
          midBadgeRef.current.style.display = 'block';
          midBadgeRef.current.style.opacity = String(Math.max(0, Math.min(1, alpha)));
          midBadgeRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
          midBadgeRef.current.style.display = 'none';
        }
      }

      // 4. Outro Collection Reveal Overlay (78% -> 100%)
      if (outroOverlayRef.current) {
        if (progress >= 0.76) {
          outroOverlayRef.current.style.display = 'flex';
          const fadeInProgress = Math.min(1, (progress - 0.76) / 0.14);
          outroOverlayRef.current.style.opacity = String(fadeInProgress);
          const translateY = 30 * (1 - fadeInProgress);
          outroOverlayRef.current.style.transform = `translateY(${translateY}px)`;
        } else {
          outroOverlayRef.current.style.display = 'none';
        }
      }

      // 5. Exit Transition Gradient (90% -> 100%)
      if (exitFadeRef.current) {
        if (progress >= 0.88) {
          const exitAlpha = (progress - 0.88) / 0.12;
          exitFadeRef.current.style.opacity = String(Math.min(1, Math.max(0, exitAlpha)));
        } else {
          exitFadeRef.current.style.opacity = '0';
        }
      }

      // 6. Frame Counter
      if (frameCounterRef.current) {
        const frameDisplay = String(frameIndex + 1).padStart(3, '0');
        const totalDisplay = String(totalFrames).padStart(3, '0');
        frameCounterRef.current.textContent = `${frameDisplay} / ${totalDisplay}`;
      }
    },
    [totalFrames]
  );

  /**
   * Main RequestAnimationFrame Render Loop
   */
  useEffect(() => {
    let isCancelled = false;

    const renderLoop = () => {
      if (isCancelled) return;

      // Smooth interpolation for fluid motion
      const current = progressRef.current;
      const target = targetProgressRef.current;
      const delta = target - current;

      if (Math.abs(delta) > 0.0001) {
        progressRef.current += delta * 0.08; // Decreased to 0.08 for a "gliding", ultra-smooth feel
      } else {
        progressRef.current = target;
      }

      const activeProgress = progressRef.current;
      const calculatedFrame = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(activeProgress * (totalFrames - 1)))
      );

      const preloader = preloaderRef.current;
      if (preloader) {
        // Prioritize loading frames near current scroll position
        preloader.setPriorityIndex(calculatedFrame);

        if (calculatedFrame !== currentFrameRef.current) {
          const img = preloader.getClosestLoadedImage(calculatedFrame);
          if (img) {
            drawImageToCanvas(img);
            currentFrameRef.current = calculatedFrame;
            onFrameChange?.(calculatedFrame, activeProgress);
          }
        }
      }

      updateOverlays(activeProgress, calculatedFrame);
      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isCancelled = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [totalFrames, drawImageToCanvas, updateOverlays, onFrameChange]);

  /**
   * Passive Scroll Listener to track section scroll percentage
   */
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;

      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / scrollableDistance;
      targetProgressRef.current = Math.max(0, Math.min(1, rawProgress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initial check
    handleScroll();
    resizeCanvas();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  /**
   * Preloader Initialization and Lifetime Management
   */
  useEffect(() => {
    const preloader = createFramePreloader({
      totalFrames,
      framePath,
      prefix,
      padDigits,
      extension,
      concurrency: 15,
      onProgress: ({ percent }) => {
        setLoadingPercent(percent);
      },
      onInitialReady: () => {
        setIsReady(true);
        // Draw frame 0 immediately
        const firstImg = preloader.getClosestLoadedImage(0);
        if (firstImg) {
          drawImageToCanvas(firstImg);
          currentFrameRef.current = 0;
        }
      },
    });

    preloaderRef.current = preloader;

    return () => {
      preloader.destroy();
      preloaderRef.current = null;
    };
  }, [totalFrames, framePath, prefix, padDigits, extension, drawImageToCanvas]);

  /**
   * Helper to scroll past the animation container smoothly
   */
  const scrollToNextSection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + rect.bottom - 40,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`auren-scroll-container ${className}`}
      style={{ height: scrollDistance }}
    >
      {/* Sticky Viewport (100vh) */}
      <div ref={stickyRef} className="auren-scroll-sticky">
        {/* Hardware-accelerated Canvas for frame rendering */}
        <canvas ref={canvasRef} className="auren-canvas" />

        {/* Ambient Top & Bottom Scrims for readability */}
        <div className="auren-vignette-top" />
        <div className="auren-vignette-bottom" />

        {/* Exit transition to blend into the next section */}
        <div ref={exitFadeRef} className="auren-section-exit-fade" style={{ opacity: 0 }} />

        {/* Minimal Luxury Loading Screen */}
        <div
          className={`auren-loader-overlay ${
            isReady ? 'auren-loader-hidden' : ''
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-light tracking-[0.3em] uppercase text-brand-cream">
              AUREN
            </h2>
            <p className="text-[10px] tracking-[0.3em] uppercase text-brand-beige/70 font-light">
              ENTERING STORE SANCTUARY
            </p>
            <div className="auren-loader-bar">
              <div
                className="auren-loader-bar-fill"
                style={{ width: `${loadingPercent}%` }}
              />
            </div>
            <span className="text-[9px] font-mono tracking-widest text-brand-cream/40">
              Loading {loadingPercent}%
            </span>
          </div>
        </div>

        {/* 1. Intro Text Overlay (0% - 25%) */}
        <div
          ref={introOverlayRef}
          className="auren-overlay-layer flex-col"
          style={{ opacity: 1 }}
        >
          <div className="max-w-3xl mx-auto space-y-4 text-center px-4">
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-brand-beige auren-text-shadow">
              Curated Men&apos;s Style / Effortless Modesty
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-brand-cream leading-tight auren-text-shadow">
              Style with Intention
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-brand-cream/80 max-w-xl mx-auto font-light leading-relaxed auren-text-shadow">
              Step inside our architectural sanctuary. Discover contemporary cuts crafted for individuals who value modern elegance and covered comfort.
            </p>
          </div>
        </div>

        {/* Scroll Indicator Prompt (0% - 15%) */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-brand-cream/70 auren-text-shadow">
              Scroll to step inside
            </span>
            <div className="w-[1.5px] h-6 bg-brand-cream/40 overflow-hidden relative">
              <div className="w-full h-full bg-brand-gold auren-scroll-pulse" />
            </div>
          </div>
        </div>

        {/* 2. Midway Entrance Milestone Badge (36% - 52%) */}
        <div
          ref={midBadgeRef}
          className="absolute top-1/2 left-1/2 z-25 pointer-events-none -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ display: 'none', opacity: 0 }}
        >
          <div className="px-5 py-2 glass-dark backdrop-blur-md border border-white/10 rounded-full inline-block shadow-2xl">
            <p className="text-[10px] sm:text-xs font-light tracking-[0.35em] uppercase text-brand-cream/90">
              Entering The Collection
            </p>
          </div>
        </div>

        {/* 3. Outro Collection Reveal Overlay (78% - 100%) */}
        <div
          ref={outroOverlayRef}
          className="auren-overlay-layer flex-col"
          style={{ display: 'none', opacity: 0 }}
        >
          <div className="max-w-2xl mx-auto space-y-5 text-center px-4">
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold auren-text-shadow">
              The AUREN Collection
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-brand-cream leading-tight auren-text-shadow">
              Discover AUREN
            </h2>
            <p className="text-xs sm:text-sm text-brand-cream/80 max-w-lg mx-auto font-light leading-relaxed auren-text-shadow">
              Explore our minimalist linen shirts, relaxed dusters, and structured tunics designed for timeless presence.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/catalog"
                className="auren-interactive-btn w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-brand-cream text-brand-charcoal hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-xl"
              >
                Shop Collection →
              </Link>
              <button
                type="button"
                onClick={scrollToNextSection}
                className="auren-interactive-btn w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest border border-brand-cream text-brand-cream hover:bg-brand-cream/15 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                Browse Looks ↓
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Frame / Progress Indicator */}
        <div className="absolute bottom-6 right-6 z-25 pointer-events-none hidden sm:block">
          <div
            ref={frameCounterRef}
            className="text-[10px] font-mono tracking-widest text-brand-cream/40 auren-text-shadow"
          >
            001 / {String(totalFrames).padStart(3, '0')}
          </div>
        </div>
      </div>
    </div>
  );
}
