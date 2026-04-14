import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition: React.FC = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Flash effect on route change
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    
    // Full transition overlay
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* Flash frame */}
      <div 
        className={`fixed inset-0 bg-white z-[9998] pointer-events-none transition-opacity duration-150 ${
          flash ? 'opacity-20' : 'opacity-0'
        }`}
      />
      
      {/* Cinematic bars wipe */}
      <div className={`fixed inset-0 z-[9997] pointer-events-none flex flex-col ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}>
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
      
      {/* Film countdown frame */}
      <div className={`fixed inset-0 z-[9996] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-[20vw] font-serif text-jelly-accent/20 animate-pulse">
          {Math.ceil(Math.random() * 3)}
        </div>
      </div>
    </>
  );
};
