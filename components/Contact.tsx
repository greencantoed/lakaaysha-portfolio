import React from 'react';
import { Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { TextScramble } from './TextScramble';
import { MagneticButton } from './MagneticButton';
import { socials } from '../content/socials';

export const Contact: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const primaryMailto =
    'mailto:lakaaysha@gmail.com?subject=Commission%20Inquiry%20%E2%80%94%20%5BProject%20Type%5D';
  const directMailto = 'mailto:lakaaysha@gmail.com';

  return (
    <section className="py-24 md:py-32 min-h-[70vh] relative overflow-hidden">
      {/* Dramatic radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,47,146,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,47,146,0.05),transparent_60%)] pointer-events-none" />
      
      {/* Decorative lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-jelly-line/20 to-transparent" />
      <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-jelly-line/20 to-transparent" />

      <div
        ref={ref}
        className={`container mx-auto px-5 md:px-8 relative z-10 chapter-reveal ${
          isInView ? 'in-view' : ''
        }`}
      >
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <span className="tc-badge text-jelly-accent block mb-3">
            TC 04 · Contact — Final Reel
          </span>
        </div>

        {/* Main content - asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left side - Main CTA */}
          <div className="lg:col-span-7">
            <h3 className="font-serif text-jelly-text text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] tracking-tight">
              <TextScramble text="Let's make" trigger="mount" />
              <br />
              <span className="text-jelly-accent glitch-text" data-text="something">
                <TextScramble text="something" trigger="mount" />
              </span>
              <br />
              <TextScramble text="together." trigger="mount" />
            </h3>
          </div>

          {/* Right side - Contact details */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <div className="space-y-8">
              {/* Contact info */}
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-jelly-muted">
                  For project inquiries
                </p>
                <a
                  href={primaryMailto}
                  className="group inline-flex items-center gap-3 text-lg md:text-xl text-jelly-text hover:text-jelly-accent transition-colors"
                >
                  <Mail size={18} className="text-jelly-accent" />
                  lakaaysha@gmail.com
                  <ArrowUpRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </div>

              {/* Divider */}
              <div className="w-16 h-px bg-jelly-line/50" />

              {/* Social */}
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-jelly-muted">
                  Follow
                </p>
                <div className="flex flex-col gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 text-jelly-text hover:text-jelly-accent transition-colors"
                    >
                      {social.id === 'instagram' ? (
                        <Instagram size={18} />
                      ) : (
                        <span className="tc-badge text-jelly-accent w-[18px] text-center">
                          {social.id === 'tiktok' ? 'tt' : 'sb'}
                        </span>
                      )}
                      <span className="text-sm uppercase tracking-[0.15em]">
                        {social.label} — {social.handle}
                      </span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick CTA */}
              <div className="pt-4">
                <MagneticButton strength={0.3}>
                  <a
                    href={directMailto}
                    className="group inline-flex items-center gap-2 border border-jelly-accent/60 bg-jelly-accent/5 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-jelly-accent transition-all duration-300 hover:bg-jelly-accent hover:text-black hover:border-jelly-accent flash-transition"
                  >
                    Start a Conversation
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
