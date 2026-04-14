import React, { useEffect, useRef, useState } from 'react';

/**
 * Double-layer cursor that reads as ONE unit:
 *   1. soft magenta glow halo (trails a couple px behind, same hue as the dot)
 *   2. crisp magenta dot (scales 3x on interactive hover)
 *
 * Both layers share a single rAF loop, one position ref, and one visibility
 * state — so they can never drift out of sync. No mix-blend-difference (the
 * color-flipping was the source of the "two fighting cursors" feeling).
 *
 * Disabled on touch + prefers-reduced-motion. Slow-frame fallback restores
 * the native OS cursor if rAF starts missing deadlines.
 */
export const FilmCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [performanceFallback, setPerformanceFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(fine && !reduced);
  }, []);

  // Toggle body class that hides the native OS cursor via CSS.
  useEffect(() => {
    const active = enabled && !performanceFallback;
    document.body.classList.toggle('film-cursor-active', active);
    return () => document.body.classList.remove('film-cursor-active');
  }, [enabled, performanceFallback]);

  useEffect(() => {
    if (!enabled || performanceFallback) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { x: target.x, y: target.y };
    const glowPos = { x: target.x, y: target.y };

    let rafId = 0;
    let visible = false;
    let lastFrame = performance.now();
    let slowFrames = 0;

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (glowRef.current) glowRef.current.style.opacity = '1';
      }
    };

    const handleWindowLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest?.(
        'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])'
      );
      setIsHovering(interactive);
    };

    const animate = (time: number) => {
      const delta = time - lastFrame;
      lastFrame = time;

      // Slow-frame fallback: if ~0.5s of sustained slowness, give up and
      // restore the native cursor so the user is never stuck without a pointer.
      if (delta > 34) slowFrames += 1;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 26) {
        setPerformanceFallback(true);
        return;
      }

      // Dot: tighter lerp, feels responsive.
      dotPos.x += (target.x - dotPos.x) * 0.22;
      dotPos.y += (target.y - dotPos.y) * 0.22;

      // Glow: slightly looser lerp — feels like a halo breathing just behind
      // the dot. The gap is small enough that they read as a single mark.
      glowPos.x += (target.x - glowPos.x) * 0.14;
      glowPos.y += (target.y - glowPos.y) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mouseleave', handleWindowLeave);
    window.addEventListener('blur', handleWindowLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseleave', handleWindowLeave);
      window.removeEventListener('blur', handleWindowLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled, performanceFallback]);

  if (!enabled || performanceFallback) return null;

  return (
    <>
      {/* Soft pink glow halo — trails behind the dot, same hue family so they read as one mark */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="film-cursor-glow"
        data-hovering={isHovering ? 'true' : 'false'}
      />
      {/* Crisp magenta dot — scales 3x on interactive hover */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="film-cursor-dot"
        data-hovering={isHovering ? 'true' : 'false'}
      />
    </>
  );
};
