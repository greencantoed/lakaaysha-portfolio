import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FilmStill } from '../types';
import { getStillAspectRatioStyle } from '../utils/imageLayout';

interface StillCarouselProps {
  stills: FilmStill[];
  projectTitle: string;
  className?: string;
  showThumbnails?: boolean;
}

export const StillCarousel: React.FC<StillCarouselProps> = ({
  stills,
  projectTitle,
  className = '',
  showThumbnails = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [stills]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  if (!stills.length) {
    return null;
  }

  const hasMultiple = stills.length > 1;
  const currentStill = stills[currentIndex];
  const isPortrait = currentStill.orientation === 'portrait';

  const next = () => {
    setCurrentIndex((previous) => (previous >= stills.length - 1 ? 0 : previous + 1));
  };

  const prev = () => {
    setCurrentIndex((previous) => (previous <= 0 ? stills.length - 1 : previous - 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) {
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setCurrentIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setCurrentIndex(stills.length - 1);
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!hasMultiple || touchStart === null) return;
    const delta = touchStart - event.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  return (
    <section className={className} aria-label={`${projectTitle} still carousel`}>
      <div
        className="relative outline-none group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label={`${projectTitle} stills`}
      >
        {/* Cinematic frame with inner shadow */}
        <figure
          className={`relative overflow-hidden bg-jelly-surface ${
            isPortrait ? 'mx-auto max-w-[16rem] md:max-w-[20rem]' : ''
          }`}
        >
          {/* Inner shadow overlay for cinematic depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] z-10 pointer-events-none" />
          
          <img
            key={currentStill.id}
            src={currentStill.url}
            alt={currentStill.alt}
            onLoad={() => setImageLoaded(true)}
            style={getStillAspectRatioStyle(currentStill)}
            className={`w-full transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} ${isPortrait ? 'object-contain' : 'object-cover'}`}
            loading="lazy"
          />
          
          {/* Caption overlay */}
          {currentStill.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-jelly-ink/90 via-jelly-ink/50 to-transparent z-20">
              <p className="text-[10px] uppercase tracking-[0.15em] text-jelly-text/80">
                {currentStill.caption}
              </p>
            </div>
          )}
        </figure>

        {/* Minimal counter */}
        <span className="absolute top-4 right-4 bg-jelly-ink/60 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-jelly-text border border-jelly-line/30">
          <span className="text-jelly-accent">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="mx-1 text-jelly-muted">/</span>
          <span className="text-jelly-muted">{String(stills.length).padStart(2, '0')}</span>
        </span>

        {hasMultiple && (
          <>
            {/* Navigation arrows - appear on hover */}
            <button
              type="button"
              onClick={prev}
              aria-label={`Previous ${projectTitle} still`}
              className="absolute top-1/2 -translate-y-1/2 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 bg-jelly-ink/80 backdrop-blur-sm border border-jelly-line/50 p-3 text-jelly-text hover:text-jelly-accent hover:border-jelly-accent"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={`Next ${projectTitle} still`}
              className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-jelly-ink/80 backdrop-blur-sm border border-jelly-line/50 p-3 text-jelly-text hover:text-jelly-accent hover:border-jelly-accent"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Film strip style thumbnails */}
      {hasMultiple && showThumbnails && (
        <div className="mt-4 overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-1.5 w-max min-w-full">
            {stills.map((still, index) => (
              <button
                key={still.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show still ${index + 1} from ${projectTitle}`}
                aria-current={index === currentIndex}
                className={`relative transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-1 ring-jelly-accent ring-offset-1 ring-offset-jelly-ink'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <span style={getStillAspectRatioStyle(still)} className="block h-12 md:h-14 w-auto min-w-[3rem]">
                  <img 
                    src={still.url} 
                    alt={still.alt} 
                    className="h-full w-full object-cover" 
                    loading="lazy" 
                  />
                </span>
                {/* Active indicator */}
                {index === currentIndex && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jelly-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
