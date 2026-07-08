import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { credibilityItems } from '../content/credibility';
import { useInView } from '../hooks/useInView';
import { KineticText } from './KineticText';

const kindLabel: Record<string, string> = {
  festival: 'Festival',
  collab: 'Collaborator',
  press: 'Press',
};

const projectLabel: Record<string, string> = {
  'gen-c': 'Gen C',
  '7-plus-1': '7+1',
  general: 'Practice',
};

export const SelectiveProof: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  if (!credibilityItems.length) {
    return null;
  }

  return (
    <div className="py-24 md:py-32 border-b border-jelly-line/30 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-jelly-accent/5 blur-[100px] pointer-events-none" />
      
      <div
        ref={ref}
        className={`container mx-auto px-5 md:px-8 relative z-10 chapter-reveal ${
          isInView ? 'in-view' : ''
        }`}
      >
        {/* Section header */}
        <div className="mb-12 md:mb-16 flex items-end justify-between border-b border-jelly-line/40 pb-5">
          <div>
            <span className="tc-badge text-jelly-accent block mb-3">
              TC 03 · Recognition
            </span>
            <h2 className="credits-head text-jelly-text" style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}>
              <KineticText scrollSpeed={0.3}>Selective Proof</KineticText>
            </h2>
          </div>
        </div>

        {/* Editorial list layout instead of grid */}
        <div className="space-y-0">
          {credibilityItems.map((item, index) => {
            const logos = [item.logo, ...(item.coLogos || [])].filter(Boolean) as string[];
            
            const content = (
              <div className="group py-6 border-b border-jelly-line/20 transition-colors hover:border-jelly-accent/30">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  {/* Index */}
                  <span className="text-[10px] text-jelly-muted/50 font-mono w-8">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Logos */}
                  {logos.length > 0 && (
                    <div className="flex items-center gap-3 min-w-[120px]">
                      {logos.slice(0, 2).map((logo, idx) => (
                        <img
                          key={`${item.id}-logo-${idx}`}
                          src={logo}
                          alt=""
                          className="h-6 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Main content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-jelly-accent">
                        {kindLabel[item.kind] || item.kind}
                      </span>
                      {item.project && (
                        <span className="text-[9px] uppercase tracking-[0.12em] text-jelly-muted/70 border border-jelly-line/50 px-2 py-0.5">
                          {projectLabel[item.project] || item.project}
                        </span>
                      )}
                    </div>
                    <p className="text-sm md:text-base text-jelly-text leading-relaxed group-hover:text-jelly-accent transition-colors">
                      {item.label}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-xs text-jelly-muted/70">{item.note}</p>
                    )}
                  </div>
                  
                  {/* Arrow indicator for linked items */}
                  {item.url && (
                    <ArrowUpRight 
                      size={16} 
                      className="text-jelly-muted/30 group-hover:text-jelly-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden md:block"
                    />
                  )}
                </div>
              </div>
            );

            if (item.url) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {content}
                </a>
              );
            }

            return <div key={item.id}>{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
};
