import { useEffect, useRef, useState } from 'react';

export function useVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef<number>();
  const velocityRef = useRef(0);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouch || prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const currentTime = Date.now();
          const deltaY = currentScroll - lastScrollRef.current;
          const deltaTime = currentTime - lastTimeRef.current;
          
          if (deltaTime > 0) {
            const newVelocity = Math.min(Math.max((deltaY / deltaTime) * 10, -20), 20);
            velocityRef.current = newVelocity;
            setVelocity(newVelocity);
          }
          
          lastScrollRef.current = currentScroll;
          lastTimeRef.current = currentTime;
          ticking = false;
          
          // Decay velocity
          setTimeout(() => {
            setVelocity((v) => v * 0.9);
          }, 50);
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return velocity;
}

// Hook for stretch effect based on velocity
export function useVelocityStretch(intensity: number = 1) {
  const velocity = useVelocity();
  
  const style = {
    transform: `skewY(${velocity * intensity}deg)`,
    transition: 'transform 0.1s ease-out',
  };

  return { velocity, style };
}
