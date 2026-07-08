import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const worldOf = (pathname: string) => (pathname.startsWith('/ink') ? 'page' : 'screen');

/**
 * In-world route transition. Crossing BETWEEN worlds is owned by the
 * WorldGate (curtain / hard cut), so this overlay stands down for those.
 * Colors ride the world CSS variables: black bars + countdown numeral on
 * film, paper bars + folio numeral on the page.
 */
export const PageTransition: React.FC = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flash, setFlash] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const prevKeyRef = useRef(location.pathname + location.hash);

  const world = worldOf(location.pathname);

  // Film countdown numeral / manuscript folio — stable per route.
  const countdownNumeral = useMemo(
    () => Math.ceil(Math.random() * 3),
    [location.pathname, location.hash]
  );

  useEffect(() => {
    // First paint is not a transition — never greet a visitor with the bars.
    // Key comparison also survives StrictMode's double-run of mount effects.
    const key = location.pathname + location.hash;
    if (prevKeyRef.current === key) {
      return;
    }
    prevKeyRef.current = key;

    const crossedWorlds = worldOf(prevPathRef.current) !== worldOf(location.pathname);
    prevPathRef.current = location.pathname;

    if (crossedWorlds) {
      // The gate's curtain or cut-flash already staged this crossing.
      setIsTransitioning(false);
      setFlash(false);
      return;
    }

    setFlash(true);
    const flashTimer = setTimeout(() => setFlash(false), 150);

    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(timer);
    };
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* Flash frame */}
      <div
        className={`fixed inset-0 bg-white z-[9998] pointer-events-none transition-opacity duration-150 ${
          flash ? 'opacity-20' : 'opacity-0'
        }`}
      />

      {/* Cinematic bars wipe — bars wear the current world's ground color */}
      <div
        className={`fixed inset-0 z-[9997] pointer-events-none flex flex-col ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`flex-1 bg-jelly-ink transition-transform duration-500 ease-in-out ${
            isTransitioning ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ transitionDelay: '0ms' }}
        />
        <div
          className={`flex-1 bg-jelly-ink transition-transform duration-500 ease-in-out ${
            isTransitioning ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ transitionDelay: '100ms' }}
        />
      </div>

      {/* Countdown frame / folio numeral */}
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`text-[20vw] animate-pulse ${
            world === 'page' ? 'marker text-thread/30' : 'font-serif text-jelly-accent/20'
          }`}
        >
          {world === 'page' ? ['01', '02', '03'][countdownNumeral - 1] : countdownNumeral}
        </div>
      </div>
    </>
  );
};
