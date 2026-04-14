import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { selectedProjects } from '../content/projects';
import { useInView } from '../hooks/useInView';
import { buildProjectHref } from '../utils/imageLayout';
import { StillCarousel } from './StillCarousel';
import { TextScramble } from './TextScramble';
import { MagneticButton } from './MagneticButton';
import { TiltCard } from './TiltCard';
import { useVelocity } from '../hooks/useVelocity';

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, isInView } = useInView({ threshold: 0.12, rootMargin: '0px 0px -100px 0px' });

  return (
    <div
      ref={ref}
      className={`chapter-reveal ${isInView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const velocity = useVelocity();
  
  return (
    <div className="py-24 md:py-32 border-b border-jelly-line/30 relative overflow-hidden">
      {/* Background ambient element */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-jelly-accent/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-5 md:px-8 relative z-10">
        {/* Section header with editorial styling */}
        <div className="mb-16 md:mb-24 flex items-end justify-between border-b border-jelly-line/40 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-jelly-muted block mb-2">
              01 — Portfolio
            </span>
            <h2 className="text-jelly-accent text-xs md:text-sm uppercase tracking-[0.25em] font-semibold">
              Selected Works
            </h2>
          </div>
          <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-jelly-muted/60">
            {String(selectedProjects.length).padStart(2, '0')} Projects
          </span>
        </div>

        <div className="space-y-28 md:space-y-40">
          {selectedProjects.map((project, index) => {
            const href = buildProjectHref(project.id);
            const hasStills = project.stills.length > 0;
            const isEven = index % 2 === 0;

            return (
              <Reveal key={project.id} delay={index * 100}>
                <article 
                  className="group"
                  style={{
                    transform: `skewY(${velocity * 0.2}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                  {/* Asymmetric layout: alternating sides */}
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? '' : 'lg:direction-rtl'
                  }`}>
                    {/* Visual side */}
                    <div className={`lg:col-span-7 ${isEven ? 'lg:col-start-1' : 'lg:col-start-6'} ${
                      isEven ? '' : 'lg:order-2'
                    }`}>
                      {hasStills ? (
                        <TiltCard tiltAmount={8} glareEnabled={true}>
                          <div className="relative">
                            {/* Decorative frame */}
                            <div className="absolute -inset-3 border border-jelly-line/30 pointer-events-none" />
                            <div className="absolute -inset-6 border border-jelly-line/10 pointer-events-none hidden md:block" />
                            
                            <StillCarousel stills={project.stills} projectTitle={project.title} />
                            
                            {/* Project number overlay */}
                            <span className="absolute -top-8 -right-2 md:-right-8 text-[6rem] md:text-[10rem] font-serif text-jelly-line/10 leading-none pointer-events-none select-none">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </TiltCard>
                      ) : (
                        <Link to={href} className="block relative">
                          <div className="absolute -inset-3 border border-jelly-line/30 pointer-events-none" />
                          <section className="border border-jelly-line/70 bg-jelly-surface-2 min-h-[35vh] md:min-h-[45vh] p-8 md:p-12 flex flex-col justify-end relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-jelly-accent/5 rounded-full blur-3xl" />
                            <div className="space-y-6 relative z-10">
                              <span className="block h-px w-20 bg-gradient-to-r from-jelly-accent/70 to-transparent" />
                              <h3 className="font-serif text-4xl md:text-6xl text-jelly-text leading-[0.9] max-w-4xl [text-wrap:balance]">
                                {project.title}
                              </h3>
                            </div>
                          </section>
                        </Link>
                      )}
                    </div>

                    {/* Content side */}
                    <div className={`lg:col-span-4 ${isEven ? 'lg:col-start-9' : 'lg:col-start-1'} ${
                      isEven ? '' : 'lg:order-1 lg:text-right'
                    }`}>
                      <div className="space-y-6">
                        {/* Meta line */}
                        <div className={`flex items-center gap-4 ${isEven ? '' : 'lg:justify-end'}`}>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-jelly-accent">
                            {project.year}
                          </span>
                          {project.commissioner && (
                            <>
                              <span className="w-8 h-px bg-jelly-line/50" />
                              <span className="text-[10px] uppercase tracking-[0.15em] text-jelly-muted">
                                {project.commissioner}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title with scramble */}
                        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-jelly-text leading-[0.95] [text-wrap:balance]">
                          <TextScramble text={project.title} trigger="hover" />
                        </h3>

                        {/* Status */}
                        {project.status && (
                          <span className="inline-block text-[10px] uppercase tracking-[0.16em] text-jelly-accent border border-jelly-accent/40 px-2.5 py-1 rounded-sm">
                            {project.status}
                          </span>
                        )}

                        {/* Crew */}
                        <div className="text-xs uppercase tracking-[0.12em] text-jelly-muted/80 leading-relaxed">
                          {project.crew.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>

                        {/* Divider */}
                        <div className={`flex items-center gap-3 pt-2 ${isEven ? '' : 'lg:justify-end'}`}>
                          <span className={`w-12 h-px bg-gradient-to-r from-jelly-accent/60 to-transparent ${isEven ? '' : 'lg:bg-gradient-to-l'}`} />
                        </div>

                        {/* Actions */}
                        <div className={`flex flex-wrap items-center gap-3 pt-2 ${isEven ? '' : 'lg:justify-end'}`}>
                          <MagneticButton strength={0.2}>
                            <Link
                              to={href}
                              className="group/btn inline-flex items-center gap-2 border border-jelly-accent/60 bg-jelly-accent/5 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-jelly-accent transition-all duration-300 hover:bg-jelly-accent hover:text-black hover:border-jelly-accent flash-transition"
                            >
                              View Project
                              <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </Link>
                          </MagneticButton>
                          <a
                            href={`mailto:lakaaysha@gmail.com?subject=${encodeURIComponent(
                              `Commission Inquiry — ${project.inquiryTag}`
                            )}`}
                            className="inline-flex items-center text-[11px] uppercase tracking-[0.16em] text-jelly-muted transition-colors hover:text-jelly-accent underline underline-offset-4 decoration-jelly-line/50 hover:decoration-jelly-accent"
                          >
                            Inquire
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};
