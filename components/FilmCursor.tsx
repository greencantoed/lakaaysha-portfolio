import React, { useEffect, useRef, useState } from 'react';
import { useWorld } from '../hooks/useWorld';

/**
 * Double-layer cursor that reads as ONE unit:
 *   1. soft glow halo (screen world only — the projector beam)
 *   2. crisp vermillion dot (both worlds; scales up on interactive hover)
 *
 * In the PAGE world the dot becomes the red pen: the glow disappears
 * (CSS) and a canvas layer draws a fading ink stroke behind the pointer —
 * faster strokes run thinner, like a nib starved of ink.
 *
 * All layers share a single rAF loop, one position ref, and one visibility
 * state — so they can never drift out of sync.
 *
 * Disabled on touch + prefers-reduced-motion. Slow-frame fallback restores
 * the native OS cursor if rAF starts missing deadlines.
 */

const TRAIL_LIFE_MS = 950;

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

export const FilmCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [performanceFallback, setPerformanceFallback] = useState(false);

  const { world } = useWorld();
  const worldRef = useRef(world);
  useEffect(() => {
    worldRef.current = world;
    // Leaving the page world: blot the ink immediately.
    const canvas = canvasRef.current;
    if (world !== 'page' && canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [world]);

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

  // Keep the trail canvas sized to the viewport (dpr-aware).
  useEffect(() => {
    if (!enabled || performanceFallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [enabled, performanceFallback]);

  useEffect(() => {
    if (!enabled || performanceFallback) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { x: target.x, y: target.y };
    const glowPos = { x: target.x, y: target.y };
    const trail: TrailPoint[] = [];

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

    const drawTrail = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Record the pen's actual (lerped) position — the ink follows the nib.
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(dotPos.x - last.x, dotPos.y - last.y) > 1.5) {
        trail.push({ x: dotPos.x, y: dotPos.y, t: now });
      }
      while (trail.length && now - trail[0].t > TRAIL_LIFE_MS) {
        trail.shift();
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (!visible || trail.length < 2) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const age = (now - b.t) / TRAIL_LIFE_MS;
        const speed = Math.hypot(b.x - a.x, b.y - a.y);
        const alpha = Math.max(0, 0.5 * (1 - age));
        // marker starves as the hand speeds up
        const width = Math.max(0.8, 3.6 - speed * 0.12);
        ctx.strokeStyle = `rgba(196, 14, 96, ${alpha.toFixed(3)})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
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

      // Glow: slightly looser lerp — a halo breathing just behind the dot.
      glowPos.x += (target.x - glowPos.x) * 0.14;
      glowPos.y += (target.y - glowPos.y) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%)`;
      }

      if (worldRef.current === 'page') {
        drawTrail(time);
      } else if (trail.length) {
        trail.length = 0;
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
      {/* Ink trail — only inked in the page world */}
      <canvas ref={canvasRef} aria-hidden="true" className="ink-trail-canvas" />
      {/* Projector-beam halo — hidden on paper via CSS */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="film-cursor-glow"
        data-hovering={isHovering ? 'true' : 'false'}
      />
      {/* Crisp vermillion dot — REC light on film, red pen on paper */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="film-cursor-dot"
        data-hovering={isHovering ? 'true' : 'false'}
      />
    </>
  );
};
