import React from 'react';
import { useInView } from '../../hooks/useInView';
import { firstReaderMailto, helloMailto } from '../../content/book';
import { socials } from '../../content/socials';

/**
 * WRITE BACK — the writer's contact. A note ripped out of the
 * notebook, a sticker to smack, no forms.
 */
export const Correspondence: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-zine-paper">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-14 md:mb-20">
          <p className="marker text-zine-pink text-base md:text-xl rotate-[-1.5deg] mb-2">
            last page —
          </p>
          <h2 className="zine-head zine-rough text-zine-ink" style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}>
            Write Back
          </h2>
          <div className="mt-3 h-[3px] w-full bg-zine-ink" />
        </div>

        <div
          ref={ref}
          className={`relative max-w-2xl mx-auto chapter-reveal ${isInView ? 'in-view' : ''}`}
        >
          <div className="zine-card relative px-8 py-12 md:px-14 md:py-14 rotate-[-0.7deg] ruled-lines">
            <span className="tape -top-4 left-1/2 -translate-x-1/2 rotate-[3deg]" aria-hidden="true" />

            <p className="tw-voice text-[10px] uppercase tracking-[0.26em] text-zine-faint mb-8">
              Amsterdam — between chapters
            </p>

            <p className="marker text-2xl md:text-3xl text-zine-ink mb-6 rotate-[-1deg]">Dear reader,</p>

            <p className="font-reader text-lg md:text-xl text-zine-soft leading-relaxed max-w-lg">
              One book is out there and one is almost. If you want the next one
              before the world gets it — leave your address.
            </p>

            <p className="hand mt-10 text-4xl md:text-5xl text-zine-ink rotate-[-2deg]">— Kaaya</p>

            <p className="tw-voice mt-8 text-xs md:text-sm text-zine-faint">
              p.s. — directors reply faster than authors.
            </p>

            {/* the sticker you actually smack */}
            <a
              href={firstReaderMailto}
              className="sticker-round absolute -bottom-12 right-6 md:-right-12 md:bottom-8 w-[118px] h-[118px] md:w-[136px] md:h-[136px] p-3"
              aria-label="Join the first reader club"
            >
              <span className="zine-head text-base md:text-lg leading-tight">FIRST<br />READER</span>
              <span className="marker text-zine-pink text-[11px] md:text-xs mt-1">club — join</span>
            </a>
          </div>

          <div className="mt-24 md:mt-16 text-center">
            <a
              href={helloMailto}
              className="proof-underline marker text-lg md:text-xl text-zine-soft hover:text-zine-pink transition-colors"
            >
              or just say hi →
            </a>
          </div>

          {/* the socials, slapped on like address labels */}
          <div className="mt-14 flex flex-wrap justify-center gap-4 md:gap-6">
            {socials.map((s, i) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="zine-card px-4 py-2.5 flex items-baseline gap-2 transition-transform duration-200 hover:-translate-y-1"
                style={{ transform: `rotate(${[-2, 1.5, -1][i % 3]}deg)` }}
              >
                <span className="zine-head text-sm md:text-base text-zine-ink">{s.label}</span>
                <span className="tw-voice text-[11px] text-zine-pink">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
