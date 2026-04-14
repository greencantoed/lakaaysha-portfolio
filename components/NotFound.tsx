import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <section className="min-h-[70vh] pt-36 pb-16 px-5 md:px-8 flex items-center">
      <div className="max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-jelly-accent mb-5">Not Found</p>
        <h1 className="font-serif text-4xl md:text-6xl text-jelly-text leading-[0.95] mb-6">
          This page does not exist.
        </h1>
        <p className="text-jelly-muted mb-10 max-w-xl">
          The link may have changed. Return to the portfolio overview to continue browsing projects.
        </p>
        <Link
          to="/#portfolio"
          className="inline-flex items-center justify-center border border-jelly-line px-6 py-3 text-xs uppercase tracking-[0.16em] text-jelly-text transition-colors hover:border-jelly-accent hover:text-jelly-accent"
        >
          Back to Works
        </Link>
      </div>
    </section>
  );
};
