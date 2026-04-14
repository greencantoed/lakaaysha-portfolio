import React from 'react';

interface FilmFrameProps {
  children: React.ReactNode;
  className?: string;
  sprocketColor?: string;
}

export const FilmFrame: React.FC<FilmFrameProps> = ({
  children,
  className = '',
  sprocketColor = 'rgba(255,47,146,0.3)',
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Left sprocket holes */}
      <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-2 z-10 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`left-${i}`}
            className="w-2 h-3 rounded-sm mx-auto"
            style={{ backgroundColor: sprocketColor }}
          />
        ))}
      </div>
      
      {/* Right sprocket holes */}
      <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-around py-2 z-10 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`right-${i}`}
            className="w-2 h-3 rounded-sm mx-auto"
            style={{ backgroundColor: sprocketColor }}
          />
        ))}
      </div>
      
      {/* Frame borders */}
      <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-jelly-line/30 to-transparent" />
      <div className="absolute left-4 right-4 bottom-0 h-px bg-gradient-to-r from-transparent via-jelly-line/30 to-transparent" />
      
      {/* Content */}
      <div className="mx-4">
        {children}
      </div>
    </div>
  );
};

// A more subtle film perforation border
export const FilmPerforation: React.FC<{
  position: 'top' | 'bottom';
  className?: string;
}> = ({ position, className = '' }) => {
  const isTop = position === 'top';
  
  return (
    <div 
      className={`absolute left-0 right-0 h-6 flex items-center justify-around px-4 pointer-events-none ${
        isTop ? 'top-0' : 'bottom-0'
      } ${className}`}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-4 rounded-sm bg-jelly-line/20"
        />
      ))}
    </div>
  );
};
