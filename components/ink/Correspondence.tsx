import React from 'react';
import { useInView } from '../../hooks/useInView';
import { socials } from '../../content/socials';

export const Correspondence: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-zine-paper">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-14 md:mb-20">
          <h2 className="zine-head zine-rough text-zine-ink" style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}>Contact</h2>
          <div className="mt-3 h-[3px] w-full bg-zine-ink" />
        </div>
        <div ref={ref} className={`relative max-w-2xl mx-auto chapter-reveal ${isInView ? 'in-view' : ''}`}>
          <div className="zine-card relative px-6 py-12 md:px-14 md:py-14 rotate-[-0.7deg] ruled-lines">
            <span className="tape -top-4 left-1/2 -translate-x-1/2 rotate-[3deg]" aria-hidden="true" />
            <p className="tw-voice text-sm uppercase tracking-[0.2em] text-zine-soft mb-6">Lakaaysha van Ewijk</p>
            <a href="mailto:lakaaysha@gmail.com" className="proof-underline marker text-lg md:text-3xl text-zine-ink hover:text-zine-pink transition-colors">lakaaysha@gmail.com</a>
            <p className="tw-voice mt-8 text-sm text-zine-soft">Amsterdam</p>
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-4 md:gap-6">
            {socials.map((s, i) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="zine-card px-4 py-2.5 flex items-baseline gap-2 transition-transform duration-200 hover:-translate-y-1" style={{ transform: `rotate(${[-2, 1.5, -1][i % 3]}deg)` }}>
                <span className="zine-head text-base text-zine-ink">{s.label}</span>
                <span className="tw-voice text-sm text-zine-pink">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
