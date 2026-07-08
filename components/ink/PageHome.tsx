import React from 'react';
import { Frontispiece } from './Frontispiece';
import { TheBooks } from './TheBooks';
import { Correspondence } from './Correspondence';
import { FilmStripPlug } from './FilmStripPlug';
import { RedThread } from './RedThread';

/** The writer's zine, stitched by one pink thread. */
export const PageHome: React.FC = () => {
  return (
    <div className="relative bg-zine-paper">
      <RedThread />

      <section id="frontispiece" className="scroll-mt-0 relative z-[2]">
        <Frontispiece />
      </section>

      <section id="books" className="scroll-mt-24 relative z-[2]">
        <TheBooks />
      </section>

      <div className="relative z-[2]">
        <FilmStripPlug />
      </div>

      <section id="letters" className="scroll-mt-24 relative z-[2]">
        <Correspondence />
      </section>
    </div>
  );
};
