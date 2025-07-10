'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SmoothScroll() {
  const router = useRouter();

  useEffect(() => {
    // Preserve scroll position on navigation
    const handleRouteChange = () => {
      // Store current scroll position
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      }
    };

    // Restore scroll position after navigation
    const restoreScrollPosition = () => {
      if (typeof window !== 'undefined') {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem('scrollPosition');
          }, 100);
        }
      }
    };

    // Listen for route changes
    window.addEventListener('beforeunload', handleRouteChange);
    
    // Restore scroll position on mount
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, []);

  return null;
} 