import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { books } from '../content/book';

/**
 * PAPER TEAR PLUG — a page of the zine torn straight across the cinema.
 * The screen admits it: she also writes.
 */
export const PaperTearPlug: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.25 });
  const queerantine = books[0];

  return (
    <section className="relative py-10 md:py-16">
      <div
        ref={ref}
        className={`deckle-top deckle-bottom relative bg-[#fffdfa] py-16 md:py-24 ruled-lines chapter-reveal ${
          isInView ? 'in-view' : ''
        }`}
      >
        {/* pink margin line */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[clamp(1.6rem,6vw,5.5rem)] w-[2px] bg-[#ed2079]/50"
        />

        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="relative">
              <p className="marker text-[#ed2079] text-lg md:text-xl rotate-[-2deg] mb-4">
                meanwhile, at the desk —
              </p>
              <p className="zine-head zine-rough text-[#141312]" style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}>
                SHE ALSO <span className="text-[#e02318]">WRITES</span>
              </p>
              <p className="tw-voice mt-5 text-xs md:text-sm text-[#7a756c]">
                a novel live on Wattpad + a second one in edit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              {/* both books, taped in */}
              <div className="relative flex items-end" aria-hidden="true">
                <div className="relative w-[92px] md:w-[120px] rotate-[-5deg] z-10">
                  <span className="tape -top-3 -left-6 rotate-[-28deg]" style={{ width: 72, height: 22 }} />
                  <img
                    src={books[0].cover}
                    alt=""
                    loading="lazy"
                    className="w-full border-2 border-[#141312]"
                    style={{ boxShadow: '4px 5px 0 rgba(20,19,18,0.85)' }}
                  />
                </div>
                <div className="relative w-[92px] md:w-[120px] rotate-[4deg] -ml-6 md:-ml-8">
                  <span className="tape -top-3 -right-6 rotate-[26deg]" style={{ width: 72, height: 22 }} />
                  <img
                    src={books[1].cover}
                    alt=""
                    loading="lazy"
                    className="w-full border-2 border-[#141312]"
                    style={{ boxShadow: '4px 5px 0 rgba(20,19,18,0.85)' }}
                  />
                </div>
                {/* reads sticker overlapping the pair */}
                <div className="starburst absolute -bottom-6 -right-8 w-[74px] h-[74px] md:w-[88px] md:h-[88px]">
                  <span className="zine-head text-sm md:text-base leading-none">{queerantine.stats?.reads}</span>
                  <span className="marker text-[8px] md:text-[9px] mt-0.5">reads</span>
                </div>
              </div>

              <Link
                to="/ink"
                className="inline-block bg-[#ed2079] border-[2.5px] border-[#141312] px-7 py-4 zine-head text-[#fffdfa] text-xl md:text-2xl transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-1deg]"
                style={{ boxShadow: '6px 6px 0 #141312' }}
              >
                turn to the page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
