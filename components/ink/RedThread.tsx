import React, { useEffect, useRef } from 'react';

/**
 * The thread — a single marker line that hand-draws itself down the
 * writer's page as you scroll, stitching the sections together.
 * Vermillion REC light on film, hot pink on paper: one thread, two worlds.
 */
export const RedThread: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.style.strokeDashoffset = '0';
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const host = wrap.parentElement;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh * 0.4;
      const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 1;
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-[1] hidden md:block" aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={pathRef}
          d="M 50 0
             C 30 40, 12 70, 10 110
             S 60 190, 88 235
             S 30 330, 12 380
             S 70 470, 90 520
             S 25 610, 10 665
             S 75 750, 88 800
             S 35 890, 50 940
             L 50 1000"
          style={{ stroke: 'var(--thread)' }}
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};
