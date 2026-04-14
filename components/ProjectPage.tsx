import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getProjectById, projects } from '../content/projects';
import { NotFound } from './NotFound';
import { StillCarousel } from './StillCarousel';

export const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;

  useEffect(() => {
    if (!project) return;
    const originalTitle = document.title;
    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name=\"description\"]');
    const originalDescription = metaDescription?.content;
    document.title = project.seoTitle || `${project.title} | Lakaaysha`;
    if (metaDescription && project.seoDescription) {
      metaDescription.content = project.seoDescription;
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.content = originalDescription;
      }
    };
  }, [project]);

  if (!projectId || !project) {
    return <NotFound />;
  }

  const projectIndex = projects.findIndex((item) => item.id === project.id);
  const previousProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  const hasStills = project.stills.length > 0;

  return (
    <article className="pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-5 md:px-8 max-w-[920px]">
        <div className="mb-8 flex items-center justify-between">
          <nav className="text-[11px] uppercase tracking-[0.14em] text-jelly-muted flex flex-wrap items-center gap-3">
            <Link to="/" className="hover:text-jelly-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to={{ pathname: '/', hash: '#portfolio' }} className="hover:text-jelly-accent transition-colors">
              Works
            </Link>
            <span>/</span>
            <span className="text-jelly-text">{project.title}</span>
          </nav>

          <Link
            to={{ pathname: '/', hash: '#portfolio' }}
            className="inline-flex items-center gap-2 border border-jelly-line/70 bg-jelly-surface px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-jelly-text hover:text-jelly-accent hover:border-jelly-accent transition-colors"
            aria-label="Close project"
          >
            <X size={16} />
            <span className="hidden md:inline">Close</span>
          </Link>
        </div>

        <header className="mb-12 md:mb-16">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-jelly-text leading-[0.92] max-w-5xl [text-wrap:balance]">
            {project.title}
          </h1>
        </header>

        {hasStills ? (
          <section className="mb-12 md:mb-16">
            <StillCarousel stills={project.stills} projectTitle={project.title} />
          </section>
        ) : (
          <section className="mb-12 md:mb-16 mx-auto max-w-[34rem] border border-jelly-line/70 bg-jelly-surface-2 min-h-[24vh] flex flex-col justify-center p-6 md:p-8">
            <p className="font-serif text-3xl md:text-5xl text-jelly-text leading-[0.95] max-w-3xl">{project.title}</p>
          </section>
        )}

        {project.youtubeUrl && (
          <section className="mb-12 md:mb-16">
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-jelly-accent px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-jelly-accent transition-colors hover:bg-jelly-accent hover:text-black"
            >
              Watch on YouTube
              <ExternalLink size={14} />
            </a>
          </section>
        )}

        <section className="mb-14 md:mb-16 max-w-3xl">
          <div className="space-y-4 text-sm text-jelly-muted leading-relaxed">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.14em]">
              <span>{project.year}</span>
              {project.commissioner && <span>{project.commissioner}</span>}
              {project.status && (
                <span className="text-jelly-accent border border-jelly-accent/40 px-2 py-0.5 rounded-sm">
                  {project.status}
                </span>
              )}
            </div>
            <div>
              {project.crew.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {project.why && (
            <div className="mt-8">
              <p className="text-jelly-muted leading-relaxed">{project.why}</p>
            </div>
          )}
        </section>

        <nav className="mt-16 pt-8 border-t border-jelly-line/50 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {previousProject ? (
            <Link
              to={`/projects/${previousProject.id}`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-jelly-muted hover:text-jelly-accent transition-colors"
            >
              <ArrowLeft size={14} />
              {previousProject.title}
            </Link>
          ) : (
            <span />
          )}

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.id}`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-jelly-muted hover:text-jelly-accent transition-colors md:ml-auto"
            >
              {nextProject.title}
              <ArrowRight size={14} />
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
};
