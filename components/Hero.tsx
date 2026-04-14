import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useVelocity } from '../hooks/useVelocity';
import { getHeroReelSelection, heroReelConfig } from '../content/heroReel';
import { TextScramble } from './TextScramble';
import { MagneticButton } from './MagneticButton';
import { FilmFrame } from './FilmFrame';

export const Hero: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const selection = useMemo(() => getHeroReelSelection(), []);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const velocity = useVelocity();

  const heroMailto =
    'mailto:lakaaysha@gmail.com?subject=Commission%20Inquiry%20%E2%80%94%20Project%20Direction';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', syncPreference);
      return () => mediaQuery.removeEventListener('change', syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  const handleVideoMetadata = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = selection.clipStart;
    setVideoLoaded(true);

    video.play().catch(() => {
      setVideoFailed(true);
    });
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.currentTime >= selection.clipEnd - 0.03) {
      video.currentTime = selection.clipStart;
      if (video.paused) {
        video.play().catch(() => {
          setVideoFailed(true);
        });
      }
    }
  };

  const shouldUseVideo = !prefersReducedMotion && !videoFailed;

  return (
    <section className="relative min-h-screen overflow-hidden dust-scratches">
      {/* Cinematic letterbox bars */}
      <div className="letterbox-bar top" />
      <div className="letterbox-bar bottom" />
      
      {/* Velocity-based distortion overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-30"
        style={{
          transform: `skewY(${velocity * 0.5}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
      
      {/* Projector flicker effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-15 mix-blend-overlay"
        style={{
          background: `rgba(255,255,255,${0.02 + Math.random() * 0.02})`,
          animation: 'flicker 0.15s infinite',
        }}
      />
      
      {/* Main media container with cinematic aspect */}
      <div className={`absolute inset-0 hero-media-intro ${isInView ? 'in-view' : ''}`}>
        <img
          src={heroReelConfig.poster}
          alt="Cinematic hero still from 7+1."
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            shouldUseVideo && videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {shouldUseVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src={heroReelConfig.source}
            poster={heroReelConfig.poster}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleVideoMetadata}
            onTimeUpdate={handleVideoTimeUpdate}
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>

      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-jelly-ink/70 via-jelly-ink/50 to-jelly-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-jelly-ink/40 via-transparent to-jelly-ink/40" />
      
      {/* Subtle scanline effect */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] pointer-events-none" />

      <FilmFrame className="relative z-10 h-full">
      <div
        ref={ref}
        className="container mx-auto px-5 md:px-8 h-screen flex flex-col justify-end pb-20 md:pb-24"
      >
        {/* Vertical accent line */}
        <div 
          className={`hero-stagger absolute left-5 md:left-8 top-1/3 w-px bg-gradient-to-b from-transparent via-jelly-accent/60 to-transparent ${
            isInView ? 'in-view' : ''
          }`}
          style={{ height: '33%', transitionDelay: '400ms' }}
        />

        <div className="max-w-5xl">
          <p 
            className={`hero-stagger text-[10px] md:text-xs uppercase tracking-[0.3em] text-jelly-muted mb-4 md:mb-6 ${
              isInView ? 'in-view' : ''
            }`}
            style={{ transitionDelay: '80ms' }}
          >
            Director · Visual Artist
          </p>

          <h1
            className={`hero-stagger font-serif text-jelly-text text-[3rem] leading-[0.9] md:text-[6.5rem] lg:text-[8rem] tracking-tight ${
              isInView ? 'in-view' : ''
            }`}
            style={{ transitionDelay: '180ms' }}
          >
            <TextScramble text="Stories that" trigger="mount" />
            <br />
            <span className="text-jelly-accent glitch-text" data-text="resonate">
              <TextScramble text="resonate" trigger="mount" />
            </span>
          </h1>

          <div
            className={`hero-stagger mt-12 md:mt-16 flex flex-wrap items-center gap-4 ${isInView ? 'in-view' : ''}`}
            style={{ transitionDelay: '320ms' }}
          >
            <MagneticButton strength={0.25}>
              <a
                href={heroMailto}
                className="group inline-flex items-center justify-center border border-jelly-accent bg-jelly-accent/10 backdrop-blur-sm px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-jelly-accent transition-all duration-300 hover:bg-jelly-accent hover:text-black"
              >
                Start a Project
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </a>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <Link
                to={{ pathname: '/', hash: '#portfolio' }}
                className="inline-flex items-center justify-center border border-jelly-line/60 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-jelly-text transition-all duration-300 hover:border-jelly-accent hover:text-jelly-accent"
              >
                View Works
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div 
          className={`hero-stagger absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${
            isInView ? 'in-view' : ''
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-jelly-muted/60">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-jelly-accent/60 to-transparent" />
        </div>
      </div>
      </FilmFrame>
    </section>
  );
};
