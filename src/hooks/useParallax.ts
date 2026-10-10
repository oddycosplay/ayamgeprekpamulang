import { useState, useEffect, useRef } from 'react';

interface ParallaxOptions {
  /** Speed multiplier: negative values move in reverse direction. Defaults to 0.2 */
  speed?: number;
  /** Max pixel shift clamp in either direction (default: 60) */
  clamp?: number;
}

/**
 * Custom hook for smooth 60fps parallax scroll effect relative to viewport center.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(options: ParallaxOptions = {}) {
  const { speed = 0.2, clamp = 80 } = options;
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const updatePosition = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate if element is anywhere near the viewport
      if (rect.bottom > -100 && rect.top < windowHeight + 100) {
        // Distance from element center to viewport center
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const delta = elementCenter - viewportCenter;

        const calculatedOffset = delta * speed;
        // Clamp offset to avoid extreme jumps on large screens or fast flick scrolling
        const clampedOffset = Math.max(-clamp, Math.min(clamp, calculatedOffset));
        setOffset(clampedOffset);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Initial run
    updatePosition();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed, clamp]);

  return { ref, offset };
}
