import { useEffect } from 'react';

/**
 * Scroll-velocity driver. Writes the current velocity into a CSS custom
 * property on <body> so CSS can consume it via `calc(var(--scroll-velocity) * …)`
 * without triggering any React re-renders.
 *
 * The value is clamped to [-20, 20] and decays ~10% per frame when the user
 * stops scrolling, all inside a single rAF loop — no setState, no setTimeout
 * stacks, no render churn.
 */
export function useVelocity() {
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      document.body.style.setProperty('--scroll-velocity', '0');
      return;
    }

    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;
    let rafId = 0;
    let hasPendingScroll = false;

    const tick = () => {
      if (hasPendingScroll) {
        const currentScroll = window.scrollY;
        const currentTime = performance.now();
        const deltaY = currentScroll - lastScroll;
        const deltaTime = currentTime - lastTime;

        if (deltaTime > 0) {
          const raw = (deltaY / deltaTime) * 10;
          velocity = Math.min(Math.max(raw, -20), 20);
        }

        lastScroll = currentScroll;
        lastTime = currentTime;
        hasPendingScroll = false;
      } else {
        // Decay toward zero when idle
        velocity *= 0.9;
        if (Math.abs(velocity) < 0.01) {
          velocity = 0;
        }
      }

      document.body.style.setProperty('--scroll-velocity', velocity.toFixed(3));
      rafId = window.requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      hasPendingScroll = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(rafId);
      document.body.style.removeProperty('--scroll-velocity');
    };
  }, []);
}
