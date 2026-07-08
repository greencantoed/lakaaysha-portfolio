import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../../hooks/useInView';

/** Three frames from the other life, taped into the book.
    Frame one is a countdown leader — type, not pixels. */
const STRIP_FRAMES: { src?: string; tc: string }[] = [
  { tc: '00:07:14:02' },
  { src: '/images/human-vs-human/Herons_main.jpg', tc: '00:02:48:11' },
  { src: '/images/human-vs-human/Reflections_MAin.png', tc: '00:11:03:19' },
];

/** Academy-leader style countdown frame, CSS only. */
const LeaderFrame: React.FC = () => (
  <div className="relative aspect-video w-full overflow-hidden bg-[#060608]">
    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/25" aria-hidden="true" />
    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/25" aria-hidden="true" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-[74%] aspect-square rounded-full border border-white/40 flex items-center justify-center">
        <span className="font-serif text-xl md:text-3xl text-white/90 leading-none">3</span>
      </div>
    </div>
  </div>
);

/**
 * FILM STRIP PLUG — a strip of celluloid pressed between the pages.
 * The page admits it: she also directs.
 */
export const FilmStripPlug: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section className="relative py-6">
      <div
        ref={ref}
        className={`relative bg-[#0a0908] py-14 md:py-20 overflow-hidden chapter-reveal ${
          isInView ? 'in-view' : ''
        }`}
        style={{ boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.6), inset 0 -10px 30px rgba(0,0,0,0.6)' }}
      >
        <div className="film-perfs absolute top-4 left-0 right-0" style={{ color: '#fffdfa' }} />
        <div className="film-perfs absolute bottom-4 left-0 right-0" style={{ color: '#fffdfa' }} />

        <div className="container mx-auto px-5 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1">
              <p className="tc-badge text-[#a5adc8] mb-4 flex items-center gap-3">
                <span className="rec-dot inline-block" />
                exhibit a — the other life
              </p>
              <p className="credits-head text-[#eef1ff]" style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}>
                she also directs
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-3 border border-[#ff2f92] bg-[#ff2f92]/10 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff2f92] transition-all duration-300 hover:bg-[#ff2f92] hover:text-black"
              >
                cross to the screen
                <span aria-hidden="true">⟶</span>
              </Link>
            </div>

            <div className="flex gap-3 md:gap-4">
              {STRIP_FRAMES.map((frame, i) => (
                <figure
                  key={frame.tc}
                  className="w-[104px] md:w-[150px] shrink-0"
                  style={{ transform: `rotate(${i === 1 ? 1.2 : i === 0 ? -2 : 2.4}deg)` }}
                >
                  <div className="border-2 border-[#1c1c24] bg-black p-1">
                    {frame.src ? (
                      <img
                        src={frame.src}
                        alt=""
                        loading="lazy"
                        className="aspect-video w-full object-cover opacity-90"
                      />
                    ) : (
                      <LeaderFrame />
                    )}
                  </div>
                  <figcaption className="tc-badge mt-2 text-center text-[#a5adc8]/60 text-[8px] md:text-[9px]">
                    {frame.tc}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
