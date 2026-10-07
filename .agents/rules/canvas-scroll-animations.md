# Canvas & Scroll Animation Guidelines

## 1. Dual-Sequence Responsive Frame Standards
- **Never serve widescreen desktop frames to mobile viewports**: 16:9 canvas frames forced onto vertical phone viewports suffer from extreme edge clipping (>60% visual loss) and excessive GPU memory pressure.
- **Provide dedicated mobile frame sequences**:
  - **Desktop**: ~16:9 widescreen (e.g., 2730×1536 or 1920×1080), compressed WebP.
  - **Mobile**: ~9:16 portrait (e.g., 720×1280), compressed WebP.
- **Payload limits**: Total mobile frame sequence payload should ideally not exceed 8–10 MB for a 200–240 frame sequence (~25–35 KB per frame).

## 2. Dynamic Runtime Resolution
- Canvas preloader controllers must detect device viewport or media queries (`window.innerWidth < 768` or `matchMedia('(max-width: 767px)')`) on mount to request the corresponding folder path:
  - Mobile: `/mobile-store-frames/`
  - Desktop: `/auren-store-frames/`
- Avoid downloading both sequences concurrently to prevent duplicate network traffic.

## 3. Mobile Performance Guardrails
- **Preload concurrency**: Throttle preloader concurrency on mobile devices (e.g., 6–8 concurrent requests on mobile vs 12–15 on desktop) to prevent radio modem bottleneck and UI thread contention during initial hydration.
- **DPR Clamping**: Restrict canvas resolution scaling via `Math.min(window.devicePixelRatio || 1, 2)` to prevent 3x/4x high-density displays from overloading canvas buffer allocations.
