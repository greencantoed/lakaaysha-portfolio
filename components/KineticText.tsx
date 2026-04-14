import React, { useRef, useEffect, useState } from 'react';

interface KineticTextProps {
  children: string;
  className?: string;
  scrollSpeed?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  children,
  className = '',
  scrollSpeed = 0.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        
        setOffset((progress - 0.5) * 100 * scrollSpeed);
        rafRef.current = undefined;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollSpeed]);

  const chars = children.split('');

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="inline-block transition-transform duration-100"
          style={{
            transform: `translateY(${Math.sin((offset + index * 5) * 0.02) * 5}px)`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

// Text that reveals on scroll with a mask
export const MaskReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          setProgress(ratio);
        });
      },
      { threshold: Array.from({ length: 100 }, (_, i) => i / 100) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="transition-opacity duration-100"
        style={{
          opacity: progress,
          transform: `translateY(${(1 - progress) * 30}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
