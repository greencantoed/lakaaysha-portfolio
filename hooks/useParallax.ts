import { useEffect, useRef, useState } from 'react';

interface ParallaxOptions {
  speed?: number; // -1 to 1, negative moves slower, positive moves faster
  direction?: 'vertical' | 'horizontal';
}

export function useParallax<T extends HTMLElement>(options: ParallaxOptions = {}) {
  const { speed = 0.1, direction = 'vertical' } = options;
  const elementRef = useRef<T>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>();
  const lastScrollRef = useRef(0);

  useEffect(() => {
    // Disable on touch devices and reduced motion preference
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouchDevice || prefersReducedMotion) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        const element = elementRef.current;
        if (!element) {
          rafRef.current = undefined;
          return;
        }

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Only calculate when element is in view
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
          const newOffset = (scrollProgress - 0.5) * speed * 100;
          setOffset(newOffset);
        }
        
        lastScrollRef.current = window.scrollY;
        rafRef.current = undefined;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  const style = direction === 'vertical' 
    ? { transform: `translateY(${offset}px)` }
    : { transform: `translateX(${offset}px)` };

  return { ref: elementRef, style, offset };
}

// Hook for mouse parallax (elements move slightly with mouse)
export function useMouseParallax<T extends HTMLElement>(intensity: number = 10) {
  const elementRef = useRef<T>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      targetRef.current = {
        x: ((e.clientX - centerX) / centerX) * intensity,
        y: ((e.clientY - centerY) / centerY) * intensity,
      };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition(targetRef.current);
          rafRef.current = undefined;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return {
    ref: elementRef,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
    },
  };
}
