import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 30,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}) => {
  const animationDirection = direction === 'left' ? 'normal' : 'reverse';

  return (
    <div 
      className={`overflow-hidden whitespace-nowrap ${pauseOnHover ? 'group' : ''} ${className}`}
    >
      <div
        className="inline-flex animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection,
        }}
      >
        <span className="inline-flex items-center group-hover:[animation-play-state:paused]">
          {children}
        </span>
        <span className="inline-flex items-center group-hover:[animation-play-state:paused]">
          {children}
        </span>
        <span className="inline-flex items-center group-hover:[animation-play-state:paused]">
          {children}
        </span>
        <span className="inline-flex items-center group-hover:[animation-play-state:paused]">
          {children}
        </span>
      </div>
    </div>
  );
};
