import React, { useRef, useEffect } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Only on desktop
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseEnter = () => {
      boundingRef.current = button.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundingRef.current) return;
      
      const { left, top, width, height } = boundingRef.current;
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      
      (button as HTMLElement).style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      (button as HTMLElement).style.transform = 'translate(0, 0)';
      boundingRef.current = null;
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  const baseClasses = `magnetic inline-block transition-transform duration-200 ease-out ${className}`;

  if (href) {
    return (
      <a ref={buttonRef as React.RefObject<HTMLAnchorElement>} href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button ref={buttonRef as React.RefObject<HTMLButtonElement>} onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
};
