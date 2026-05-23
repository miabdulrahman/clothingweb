'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logAnalyticsEventAction as logAnalyticsEvent } from '@/lib/actions';

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Log page view on path changes
  useEffect(() => {
    // We ignore admin page views in our public metrics to keep statistics accurate
    if (pathname.startsWith('/admin')) return;

    logAnalyticsEvent(
      'page_view',
      {
        url: `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      },
      pathname
    );
  }, [pathname, searchParams]);

  // 2. Intercept and log all WhatsApp button/link clicks globally
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        if (href.includes('wa.me') || href.includes('whatsapp.com')) {
          logAnalyticsEvent(
            'whatsapp_click',
            {
              url: href,
              originPath: window.location.pathname,
              label: anchor.innerText || anchor.getAttribute('aria-label') || 'WhatsApp Link',
            },
            window.location.pathname
          );
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
