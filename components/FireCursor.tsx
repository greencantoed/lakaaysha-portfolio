import React, { useEffect, useRef, useState } from 'react';

type EmberParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

const EMBER_COUNT = 14;

const isInteractiveElement = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    element.closest('a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])')
  );
};

export const FireCursor: React.FC = () => {
  const flameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const emberRefs = useRef<HTMLSpanElement[]>([]);

  const [enabled, setEnabled] = useState(false);
  const [performanceFallback, setPerformanceFallback] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(!prefersReducedMotion && isFinePointer);
  }, []);

  useEffect(() => {
    const shouldHideNativeCursor = enabled && !performanceFallback;
    document.body.classList.toggle('fire-cursor-active', shouldHideNativeCursor);

    return () => {
      document.body.classList.remove('fire-cursor-active');
    };
  }, [enabled, performanceFallback]);

  useEffect(() => {
    if (!enabled || performanceFallback) {
      return;
    }

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const previous = { x: current.x, y: current.y };

    const embers: EmberParticle[] = Array.from({ length: EMBER_COUNT }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
    }));

    let pointerVisible = false;
    let hoveringInteractive = false;
    let rafId = 0;
    let lastFrameTime = performance.now();
    let lastMoveTime = performance.now();
    let slowFrames = 0;

    const setEmberRef = (index: number, node: HTMLSpanElement | null) => {
      if (node) {
        emberRefs.current[index] = node;
      }
    };

    // Ensure refs are synced before first frame.
    emberRefs.current.forEach((node, index) => {
      setEmberRef(index, node);
    });

    const spawnEmber = () => {
      const particle = embers.find((item) => item.life <= 0);
      if (!particle) {
        return;
      }

      particle.x = current.x;
      particle.y = current.y;
      particle.vx = (Math.random() - 0.5) * 1.1;
      particle.vy = -(Math.random() * 1.6 + 0.25);
      particle.life = 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      pointerVisible = true;
      lastMoveTime = performance.now();

      if (Math.random() > 0.42) {
        spawnEmber();
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      hoveringInteractive = isInteractiveElement(event.target);
    };

    const handleWindowLeave = () => {
      pointerVisible = false;
    };

    const animate = (time: number) => {
      const delta = time - lastFrameTime;
      lastFrameTime = time;

      if (delta > 34) {
        slowFrames += 1;
      } else {
        slowFrames = Math.max(0, slowFrames - 1);
      }

      if (slowFrames > 26) {
        setPerformanceFallback(true);
        return;
      }

      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;

      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const speed = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const idle = time - lastMoveTime > 170;

      const flicker = idle ? 0.94 + Math.sin(time / 160) * 0.035 : 1 + Math.sin(time / 48) * 0.08;
      const stretch = Math.min(1.45, 1 + speed * 0.05);
      const interactiveBoost = hoveringInteractive ? 1.28 : 1;

      if (flameRef.current) {
        flameRef.current.style.opacity = pointerVisible ? '1' : '0';
        flameRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotate(${angle + 90}deg) scale(${interactiveBoost}, ${stretch * flicker})`;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = pointerVisible ? '0.78' : '0';
        glowRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${(hoveringInteractive ? 1.55 : 1.2) * flicker})`;
      }

      for (let i = 0; i < embers.length; i += 1) {
        const ember = embers[i];
        const node = emberRefs.current[i];
        if (!node) {
          continue;
        }

        if (!pointerVisible || ember.life <= 0) {
          node.style.opacity = '0';
          continue;
        }

        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vy -= 0.01;
        ember.vx *= 0.99;
        ember.life -= 0.017;

        if (ember.life <= 0) {
          node.style.opacity = '0';
          continue;
        }

        const emberScale = 0.45 + ember.life * 0.95;
        node.style.opacity = `${ember.life * 0.68}`;
        node.style.transform = `translate3d(${ember.x}px, ${ember.y}px, 0) scale(${emberScale})`;
      }

      previous.x = current.x;
      previous.y = current.y;
      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseleave', handleWindowLeave);
    window.addEventListener('blur', handleWindowLeave);

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseleave', handleWindowLeave);
      window.removeEventListener('blur', handleWindowLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled, performanceFallback]);

  if (!enabled || performanceFallback) {
    return null;
  }

  return (
    <>
      <div
        ref={glowRef}
        className="fire-cursor-glow"
        aria-hidden="true"
      />

      <div
        ref={flameRef}
        className="fire-cursor"
        aria-hidden="true"
      >
        <svg width="42" height="56" viewBox="0 0 42 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flameOuterGradient" x1="21" y1="0" x2="21" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF58F" />
              <stop offset="0.45" stopColor="#FF9721" />
              <stop offset="1" stopColor="#FF2F57" />
            </linearGradient>
            <linearGradient id="flameInnerGradient" x1="21" y1="7" x2="21" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFDE4" />
              <stop offset="0.62" stopColor="#FFC35A" />
              <stop offset="1" stopColor="#FF5D42" />
            </linearGradient>
          </defs>
          <path
            d="M20.9 2.2C24.7 9.4 34.5 13.8 34.5 26.1C34.5 37.7 26.8 49 21 53.7C15.6 49.5 7.5 40.1 7.5 28.8C7.5 18.2 13.9 12.5 16.8 7.8C18.1 5.7 19.1 3.9 20.9 2.2Z"
            fill="url(#flameOuterGradient)"
          />
          <path
            d="M20.9 10.2C23.4 14.8 28.9 18.1 28.9 25.2C28.9 32.2 24.5 38.5 20.9 41.6C17.1 38.6 13 32.8 13 26.6C13 20.6 16.3 17.2 18.1 14.2C19.1 12.8 19.8 11.4 20.9 10.2Z"
            fill="url(#flameInnerGradient)"
          />
        </svg>
      </div>

      {Array.from({ length: EMBER_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            if (node) {
              emberRefs.current[index] = node;
            }
          }}
          className="fire-cursor-ember"
          aria-hidden="true"
        />
      ))}
    </>
  );
};
