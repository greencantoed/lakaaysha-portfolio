import React from 'react';
import { useInView } from '../hooks/useInView';

export const About: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <div className="py-24 md:py-28 border-b border-jelly-line/40">
      <div
        ref={ref}
        className={`container mx-auto px-5 md:px-8 max-w-4xl chapter-reveal ${isInView ? 'in-view' : ''}`}
      >
        <h2 className="text-jelly-accent text-[11px] md:text-xs uppercase tracking-[0.2em] font-semibold mb-10">
          About / Method
        </h2>

        <p className="text-2xl md:text-4xl font-serif leading-[1.14] mb-8 text-jelly-text">
          I work where memory collides with public space.
        </p>

        <p className="text-sm md:text-base leading-relaxed max-w-3xl text-jelly-muted">
          Documentary, cinepoem, and experimental language are tools, not categories. The practice
          is to build images that hold contradiction: intimacy and friction, lyric and rupture,
          tenderness and structural violence. Every film begins with people and place, then pushes
          toward form that refuses neutrality.
        </p>
      </div>
    </div>
  );
};
