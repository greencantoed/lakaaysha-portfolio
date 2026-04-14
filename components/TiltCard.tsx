import React, { useRef, useEffect, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnabled?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltAmount = 10,
  glareEnabled = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    let rafId = 0;
    let pending: { x: number; y: number } | null = null;

    const flush = () => {
      rafId = 0;
      if (!pending) return;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = pending.x - centerX;
      const mouseY = pending.y - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -tiltAmount;
      const rotateY = (mouseX / (rect.width / 2)) * tiltAmount;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );

      const glareX = ((pending.x - rect.left) / rect.width) * 100;
      const glareY = ((pending.y - rect.top) / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY });
      pending = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!rafId) {
        rafId = window.requestAnimationFrame(flush);
      }
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      pending = null;
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [tiltAmount]);

  return (
    <div
      ref={cardRef}
      className={`relative transform-gpu transition-transform duration-100 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {children}
      
      {/* Glare overlay */}
      {glareEnabled && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            transform: 'translateZ(1px)',
          }}
        />
      )}
    </div>
  );
};
