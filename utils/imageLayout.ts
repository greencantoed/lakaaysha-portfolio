import type { FilmStill, Project, StillOrientation } from '../types';
import type { CSSProperties } from 'react';

export const getStillOrientation = (width: number, height: number): StillOrientation => {
  if (width === height) {
    return 'square';
  }

  return width > height ? 'landscape' : 'portrait';
};

export const getStillAspectRatio = (still: FilmStill): number => {
  if (still.width <= 0 || still.height <= 0) {
    return 16 / 9;
  }

  return still.width / still.height;
};

export const getStillAspectRatioStyle = (still: FilmStill): CSSProperties => ({
  aspectRatio: `${still.width} / ${still.height}`,
});

export const getMasonryWidthClass = (still: FilmStill): string => {
  if (still.orientation === 'portrait') {
    return 'max-w-[28rem]';
  }

  if (still.orientation === 'square') {
    return 'max-w-[38rem]';
  }

  return 'max-w-full';
};

export const getProjectHeroStill = (project: Project): FilmStill | null => {
  return project.stills[0] ?? null;
};

export const buildProjectHref = (projectId: string): string => `/projects/${projectId}`;
