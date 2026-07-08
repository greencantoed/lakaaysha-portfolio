import React from 'react';
import { useInView } from '../../hooks/useInView';
import { books, firstReaderMailto, type Book } from '../../content/book';
import { sealedLinesForTease } from './sealedTease';

const ZineHead: React.FC<{ kicker: string; title: string; note: string }> = ({ kicker, title, note }) => (
  <div className="mb-14 md:mb-20">
    <p className="marker text-zine-pink text-base md:text-xl rotate-[-1.5deg] mb-2">{kicker}</p>
    <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
      <h2 className="zine-head zine-rough text-zine-ink" style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}>
        {title}
      </h2>
      <span className="tw-voice text-xs md:text-sm text-zine-faint pb-2 md:pb-4">{note}</span>
    </div>
    <div className="mt-3 h-[3px] w-full bg-zine-ink" />
  </div>
);

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="toc-row tw-voice text-sm md:text-base">
    <dt className="uppercase tracking-[0.18em] text-[11px] md:text-xs text-zine-faint">{label}</dt>
    <span className="toc-leader" aria-hidden="true" />
    <dd className="text-zine-ink font-semibold">{value}</dd>
  </div>
);

const BookCover: React.FC<{ book: Book; flip?: boolean }> = ({ book, flip }) => (
  <div
    className={`group/cover relative mx-auto w-[240px] md:w-[320px] transition-transform duration-300 cubic-bezier(0.34,1.56,0.64,1) ${
      flip
        ? 'rotate-[2.5deg] hover:rotate-[0.5deg] hover:-translate-y-2'
        : 'rotate-[-2.5deg] hover:rotate-[-0.5deg] hover:-translate-y-2'
    }`}
  >
    <span className={`tape -top-3.5 ${flip ? '-right-9 rotate-[30deg]' : '-left-9 rotate-[-30deg]'} z-10`} aria-hidden="true" />
    <div className="halftone-hover border-[3px] border-zine-ink" style={{ boxShadow: '8px 9px 0 #141312' }}>
      <img src={book.cover} alt={book.coverAlt} className="block w-full" loading="lazy" />
    </div>
    <span
      className={`stamp absolute text-sm md:text-base bg-zine-paper/85 ${
        flip ? '-left-5 bottom-8 rotate-[5deg]' : '-right-5 bottom-8 rotate-[-7deg]'
      }`}
    >
      {book.stamp}
    </span>
  </div>
);

/**
 * THE BOOKS — not promises: objects. One you can read tonight,
 * one being sharpened.
 */
export const TheBooks: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  const [queerantine, lovebombing] = books;

  return (
    <section className="py-24 md:py-32 relative bg-zine-paper">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <ZineHead kicker="exhibit one & two" title="The Books" note="— both real, one readable tonight" />

        <div ref={ref} className={`chapter-reveal ${isInView ? 'in-view' : ''}`}>
          {/* № 01 — QUEERANTINE, live */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <BookCover book={queerantine} />
            </div>

            <div className="lg:col-span-7 lg:pl-6">
              <p className="tw-voice text-[11px] md:text-xs uppercase tracking-[0.24em] text-zine-faint mb-3">
                № 01 — {queerantine.format} · {queerantine.year} · ongoing
              </p>
              <h3 className="zine-head text-zine-pink" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
                {queerantine.title}
              </h3>

              <p className="mt-5 font-reader text-lg md:text-xl text-zine-soft leading-relaxed max-w-xl">
                {queerantine.blurb}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {queerantine.tags.map((tag) => (
                  <span key={tag} className="marker text-xs md:text-sm text-zine-paper bg-zine-ink px-2.5 py-1 rotate-[-1deg]">
                    {tag}
                  </span>
                ))}
              </div>

              {queerantine.stats && (
                <dl className="mt-7 max-w-md space-y-3">
                  <StatRow label="reads" value={queerantine.stats.reads} />
                  <StatRow label="votes" value={queerantine.stats.votes} />
                  <StatRow label="parts" value={queerantine.stats.parts} />
                  <StatRow label="drops" value={queerantine.stats.schedule} />
                </dl>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href={queerantine.url}
                  target="_blank"
                  rel="noreferrer"
                  className="zine-card-pink px-6 py-3.5 zine-head text-zine-paper text-lg md:text-xl transition-transform duration-200 hover:-translate-y-1"
                >
                  Read on Wattpad →
                </a>
                <span className="hand text-xl md:text-2xl text-zine-soft rotate-[-2deg]">free, the whole thing</span>
              </div>
            </div>
          </article>

          {/* divider scribble */}
          <div className="my-20 md:my-28 flex items-center gap-5" aria-hidden="true">
            <span className="marker text-zine-pink text-2xl">✂</span>
            <span className="flex-1 border-t-[3px] border-dashed border-zine-ink/30" />
          </div>

          {/* № 02 — LOVEBOMBING, in edit */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <p className="tw-voice text-[11px] md:text-xs uppercase tracking-[0.24em] text-zine-faint mb-3">
                № 02 — {lovebombing.format} · {lovebombing.year}
              </p>
              <h3 className="zine-head text-zine-red max-w-2xl" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.8rem)' }}>
                {lovebombing.title}
              </h3>

              <p className="mt-5 tw-voice text-base md:text-lg text-zine-soft max-w-xl">{lovebombing.blurb}</p>

              {/* one redacted paragraph — the tease */}
              <div className="mt-7 max-w-xl space-y-[0.9em]" aria-label="Excerpt withheld while in edit">
                {sealedLinesForTease.map((row, i) => (
                  <div key={i} className="flex flex-wrap items-baseline gap-x-[0.45em]" aria-hidden="true">
                    {row.map((w, j) => (
                      <span key={j} className="ink-redact" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ))}
                <p className="marker text-zine-pink text-base md:text-lg rotate-[-1deg]">
                  unredacts at publication ↑
                </p>
              </div>

              <a
                href={firstReaderMailto}
                className="mt-8 inline-block zine-card px-6 py-3.5 zine-head text-zine-ink text-lg md:text-xl transition-transform duration-200 hover:-translate-y-1 hover:bg-zine-ink hover:text-zine-paper"
              >
                Be the first reader →
              </a>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <BookCover book={lovebombing} flip />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
