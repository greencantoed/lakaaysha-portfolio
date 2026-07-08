import React from 'react';
import { Typewriter } from './Typewriter';
import { books, firstReaderMailto } from '../../content/book';
import { socials } from '../../content/socials';

/** Deterministic slam wobble per glyph index. */
const ROTS = [-6, 4, -3, 7, -5, 3, -7, 5, -2, 6, -4, 2];

const StampLine: React.FC<{
  text: string;
  baseDelay: number;
  className?: string;
  perChar?: number;
}> = ({ text, baseDelay, className = '', perChar = 30 }) => (
  <span className={className} aria-label={text} role="text">
    {Array.from(text).map((ch, i) => (
      <span
        key={`${ch}-${i}`}
        aria-hidden="true"
        className="stamp-in"
        style={
          {
            '--stamp-delay': `${baseDelay + i * perChar}ms`,
            '--stamp-rot': `${ROTS[i % ROTS.length]}deg`,
            whiteSpace: ch === ' ' ? 'pre' : undefined,
          } as React.CSSProperties
        }
      >
        {ch === ' ' ? ' ' : ch}
      </span>
    ))}
  </span>
);

/**
 * FRONT PAGE OF THE ZINE — white notebook, pink margin, Anton shouting.
 * Not a manifesto: a table of contents with attitude.
 */
export const Frontispiece: React.FC = () => {
  const queerantine = books[0];

  return (
    <section className="relative min-h-screen overflow-hidden ruled-lines red-margin flex flex-col bg-zine-paper">
      <div className="spiral-rail hidden md:block" aria-hidden="true" />

      <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center relative z-10 pt-28 pb-20">
        <p className="marker text-zine-pink text-lg md:text-2xl rotate-[-2deg] mb-4 md:mb-6">
          director by light —
        </p>

        <h1 className="zine-head zine-rough text-zine-ink" style={{ fontSize: 'clamp(4rem, 14.5vw, 15rem)' }}>
          <StampLine text="AUTHOR" baseDelay={200} className="block" />
          <span className="block">
            <StampLine text="BY " baseDelay={650} />
            <span className="relative inline-block text-zine-red">
              <StampLine text="INK." baseDelay={800} />
              {/* hand-drawn circle around the word */}
              <svg className="scribble-circle draw" viewBox="0 0 300 130" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 30 88 C 15 45, 80 12, 160 14 C 245 16, 292 42, 286 70 C 279 103, 195 122, 110 116 C 45 111, 18 92, 34 62" />
              </svg>
            </span>
          </span>
        </h1>

        <div className="mt-8 md:mt-12 max-w-2xl">
          <Typewriter
            text="two books. one live on Wattpad, one in edit."
            className="text-sm md:text-lg text-zine-soft"
            startDelay={1500}
          />
        </div>

        <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-x-8 gap-y-6">
          <a
            href={queerantine.url}
            target="_blank"
            rel="noreferrer"
            className="zine-card-pink px-7 py-4 zine-head text-zine-paper text-xl md:text-2xl tracking-wide transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-1deg]"
          >
            Read Queerantine free →
          </a>
          <a
            href={firstReaderMailto}
            className="proof-underline marker text-lg md:text-xl text-zine-ink hover:text-zine-pink transition-colors"
          >
            join the first reader club
          </a>
        </div>

        {/* find me — scribbled in the margin */}
        <div className="mt-10 md:mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="tw-voice text-[10px] uppercase tracking-[0.3em] text-zine-faint">find me</span>
          {socials.map((s, i) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="marker text-base md:text-lg text-zine-soft hover:text-zine-pink transition-colors"
              style={{ transform: `rotate(${i % 2 ? 1.2 : -1.4}deg)` }}
            >
              {s.label.toLowerCase()} ↗
            </a>
          ))}
        </div>
      </div>

      {/* reads sticker, half off the fold */}
      <div
        className="starburst absolute -right-5 bottom-40 md:right-auto md:left-16 md:bottom-16 w-[110px] h-[110px] md:w-[150px] md:h-[150px] z-10"
        aria-hidden="true"
      >
        <span className="zine-head text-2xl md:text-3xl leading-none">7.5K</span>
        <span className="marker text-[10px] md:text-xs mt-1">reads &amp; counting</span>
      </div>

      <div className="relative z-10 pb-8 flex justify-center">
        <span className="tw-voice text-[10px] tracking-[0.4em] uppercase text-zine-faint">
          flip ⤵
        </span>
      </div>
    </section>
  );
};
