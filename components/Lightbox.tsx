import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Project } from '../types';
import { getStillAspectRatioStyle } from '../utils/imageLayout';

interface LightboxProps {
  project: Project;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectStill: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  project,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSelectStill,
}) => {
  const currentStill = project.stills[currentIndex];
  const hasMultiple = project.stills.length > 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    firstFocusable?.focus();

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };

    container.addEventListener('keydown', handleTab);

    return () => container.removeEventListener('keydown', handleTab);
  }, [currentIndex]);

  useEffect(() => {
    if (!hasMultiple) {
      return;
    }

    const preload = (index: number) => {
      if (index < 0 || index >= project.stills.length) {
        return;
      }

      const image = new Image();
      image.src = project.stills[index].url;
    };

    preload(currentIndex + 1);
    preload(currentIndex - 1);
  }, [currentIndex, hasMultiple, project.stills]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key.toLowerCase() === 'x') {
        onClose();
      }

      if (event.key === 'ArrowRight' && hasMultiple) {
        onNext();
      }

      if (event.key === 'ArrowLeft' && hasMultiple) {
        onPrev();
      }
    },
    [hasMultiple, onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!hasMultiple || touchStart === null) {
      return;
    }

    const delta = touchStart - event.changedTouches[0].clientX;

    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        onNext();
      } else {
        onPrev();
      }
    }

    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox: ${project.title}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 md:px-6 py-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
          <span className="text-white/90 font-serif text-sm md:text-base normal-case tracking-normal">{project.title}</span>
          <span className="mx-2">&middot;</span>
          {project.year}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="inline-flex items-center gap-2 border border-white/30 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-all duration-300 text-white/80 hover:text-white hover:border-jelly-accent hover:bg-black/75"
          aria-label="Close lightbox"
          aria-keyshortcuts="Escape X"
        >
          <X size={16} />
          <span>Close</span>
        </button>
      </div>

      <div
        className="relative z-10 flex flex-col items-center max-w-[92rem] w-full h-full px-4 pt-16 pb-4 md:pt-16 md:pb-6"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 flex items-center justify-center w-full relative min-h-0">
          {hasMultiple && (
            <button
              onClick={onPrev}
              className="absolute left-0 md:left-4 z-20 p-3 border border-white/30 bg-black/55 transition-all duration-300 text-white opacity-60 hover:opacity-100 hover:border-jelly-accent"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <img
            key={currentStill.id}
            src={currentStill.url}
            alt={currentStill.alt}
            onLoad={() => setImageLoaded(true)}
            style={getStillAspectRatioStyle(currentStill)}
            className={`max-h-[70vh] md:max-h-[76vh] max-w-full object-contain transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {hasMultiple && (
            <button
              onClick={onNext}
              className="absolute right-0 md:right-4 z-20 p-3 border border-white/30 bg-black/55 transition-all duration-300 text-white opacity-60 hover:opacity-100 hover:border-jelly-accent"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center gap-4">
          {hasMultiple && (
            <div className="flex gap-2 overflow-x-auto max-w-full pb-1" role="tablist" aria-label="Image thumbnails">
              {project.stills.map((still, index) => (
                <button
                  key={still.id}
                  onClick={() => onSelectStill(index)}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`View image ${index + 1}`}
                  style={getStillAspectRatioStyle(still)}
                  className={`h-16 md:h-20 flex-shrink-0 overflow-hidden transition-all duration-300 border ${
                    index === currentIndex
                      ? 'border-jelly-accent scale-105'
                      : 'border-jelly-line/70 opacity-55 hover:opacity-85'
                  }`}
                >
                  <img src={still.url} alt={still.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {project.youtubeUrl && (
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border transition-all duration-300 border-jelly-accent text-jelly-accent hover:bg-jelly-accent hover:text-black"
            >
              <span className="uppercase tracking-[0.2em] text-sm font-medium">Watch on YouTube</span>
              <ExternalLink size={16} />
            </a>
          )}

          {hasMultiple && (
            <p className="text-white/40 text-sm font-mono">
              {currentIndex + 1} / {project.stills.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
