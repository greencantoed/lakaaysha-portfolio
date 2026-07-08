import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { archiveProjects } from '../content/projects';
import { Lightbox } from './Lightbox';
import { TiltCard } from './TiltCard';
import type { Project } from '../types';
import { getStillAspectRatioStyle } from '../utils/imageLayout';
import { composePhotoChoreography, formatStillNumber } from '../utils/photoChoreography';

export const ArtPile: React.FC = () => {
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (project: Project, stillIndex = 0) => {
    if (!project.stills.length) {
      return;
    }

    setLightboxProject(project);
    setLightboxIndex(stillIndex);
  };

  const closeLightbox = () => {
    setLightboxProject(null);
    setLightboxIndex(0);
  };

  const nextStill = () => {
    if (!lightboxProject) {
      return;
    }

    setLightboxIndex((prev) => (prev >= lightboxProject.stills.length - 1 ? 0 : prev + 1));
  };

  const prevStill = () => {
    if (!lightboxProject) {
      return;
    }

    setLightboxIndex((prev) => (prev <= 0 ? lightboxProject.stills.length - 1 : prev - 1));
  };

  if (!archiveProjects.length) {
    return null;
  }

  return (
    <div className="py-24 md:py-32 border-b border-jelly-line/30 overflow-hidden relative">
      {/* Ambient background */}
      <div className="absolute top-1/3 -left-1/4 w-[500px] h-[500px] rounded-full bg-jelly-accent/3 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-5 md:px-8 mb-16 relative z-10">
        <div className="flex items-end justify-between border-b border-jelly-line/40 pb-5">
          <div>
            <span className="tc-badge text-jelly-accent block mb-3">
              TC 02 · Archive
            </span>
            <h2 className="credits-head text-jelly-text" style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}>
              Visual Collection
            </h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[980px]">
        {archiveProjects.map((project, index) => {
          const rows = composePhotoChoreography(project.stills, { includeLead: true });
          const sequenceItems = rows.flatMap((row) =>
            row.items.map((item) => ({
              item,
              rowKind: row.kind,
            }))
          );
          const uniqueItems = Array.from(
            new Map(sequenceItems.map((entry) => [entry.item.still.url, entry])).values()
          );
          const portraitItems = uniqueItems.filter((entry) => entry.item.still.orientation === 'portrait');
          const portraitStripItems = portraitItems.length > 0 ? portraitItems : [];
          const gridItems =
            portraitStripItems.length > 0
              ? uniqueItems.filter((entry) => entry.item.still.orientation !== 'portrait')
              : uniqueItems;

          return (
            <section key={project.id} className="mb-20 md:mb-24 last:mb-0">
              {/* Editorial header with number */}
              <header className="mb-8 md:mb-10 flex items-start gap-6 md:gap-10">
                <span className="text-[4rem] md:text-[6rem] font-serif text-jelly-line/15 leading-none select-none -mt-2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 pt-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-jelly-accent">
                      {project.year}
                    </span>
                    {project.commissioner && (
                      <>
                        <span className="w-6 h-px bg-jelly-line/40" />
                        <span className="text-[10px] uppercase tracking-[0.15em] text-jelly-muted">
                          {project.commissioner}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl text-jelly-text leading-[0.95] [text-wrap:balance]">
                    {project.title}
                  </h3>
                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 mt-4 text-[11px] uppercase tracking-[0.14em] text-jelly-muted hover:text-jelly-accent transition-colors group"
                  >
                    Explore Project
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </header>

              {!uniqueItems.length ? (
                <div className="mb-4 min-h-[30vh] border border-dashed border-jelly-line bg-jelly-surface-2 flex items-center justify-center px-6 text-center">
                </div>
              ) : (
                <>
                  {portraitStripItems.length > 0 && (
                    <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                      <div className="flex gap-4 md:gap-5 w-max min-w-full">
                        {portraitStripItems.map(({ item }, pidx) => (
                          <TiltCard key={`portrait-strip-${item.still.id}`} tiltAmount={5} glareEnabled={false}>
                            <button
                              type="button"
                              className="still-surface group block w-[10rem] md:w-[12rem] text-left relative"
                              onClick={() => openLightbox(project, item.stillIndex)}
                              aria-label={`Open still ${item.stillIndex + 1} from ${project.title}`}
                              style={{ transform: `rotate(${pidx % 2 === 0 ? -1 : 1}deg)` }}
                            >
                              {/* Polaroid-style frame */}
                              <div className="bg-jelly-surface p-2 pb-8 shadow-lg border border-jelly-line/30 transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-0">
                                <img
                                  src={item.still.url}
                                  alt={item.still.alt}
                                  style={getStillAspectRatioStyle(item.still)}
                                  className="w-full object-contain bg-jelly-ink"
                                  loading="lazy"
                                />
                              </div>
                              <span className="absolute bottom-2 left-0 right-0 text-center text-[9px] uppercase tracking-[0.12em] text-jelly-muted">
                                {formatStillNumber(item.stillIndex)}
                              </span>
                            </button>
                          </TiltCard>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Editorial masonry grid with varied sizes */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {gridItems.map(({ item, rowKind }, gidx) => {
                      const isPortrait = item.still.orientation === 'portrait';
                      const isLead = rowKind === 'lead';
                      
                      // Create varied sizes for editorial feel
                      const sizeClass = isLead 
                        ? 'col-span-2 row-span-2'
                        : isPortrait 
                          ? 'col-span-1 row-span-2'
                          : gidx % 5 === 0 
                            ? 'col-span-2'
                            : 'col-span-1';

                      return (
                        <button
                          key={item.still.id}
                          type="button"
                          className={`still-surface group relative text-left overflow-hidden ${sizeClass}`}
                          onClick={() => openLightbox(project, item.stillIndex)}
                          aria-label={`Open still ${item.stillIndex + 1} from ${project.title}`}
                        >
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-jelly-accent/0 transition-colors duration-500 group-hover:bg-jelly-accent/10 z-10" />
                          
                          <img
                            src={item.still.url}
                            alt={item.still.alt}
                            style={getStillAspectRatioStyle(item.still)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          
                          {/* Caption overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-jelly-ink/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                            <span className="text-[9px] uppercase tracking-[0.14em] text-jelly-text">
                              {formatStillNumber(item.stillIndex)}
                              {item.still.caption ? ` · ${item.still.caption}` : ''}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>

      {lightboxProject && (
        <Lightbox
          project={lightboxProject}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextStill}
          onPrev={prevStill}
          onSelectStill={setLightboxIndex}
        />
      )}
    </div>
  );
};
