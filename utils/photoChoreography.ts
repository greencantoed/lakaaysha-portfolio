import type { FilmStill } from '../types';

export type PhotoChoreographyRowKind = 'lead' | 'full' | 'dual-portrait' | 'mixed' | 'single';

export interface PhotoChoreographyItem {
  still: FilmStill;
  stillIndex: number;
}

export interface PhotoChoreographyRow {
  id: string;
  kind: PhotoChoreographyRowKind;
  items: PhotoChoreographyItem[];
}

interface PhotoChoreographyOptions {
  includeLead?: boolean;
  startIndex?: number;
}

const makeItem = (still: FilmStill, stillIndex: number): PhotoChoreographyItem => ({
  still,
  stillIndex,
});

const isPortrait = (still: FilmStill) => still.orientation === 'portrait';
const isLandscapeLike = (still: FilmStill) => still.orientation === 'landscape' || still.orientation === 'square';

export const composePhotoChoreography = (
  stills: FilmStill[],
  options: PhotoChoreographyOptions = {}
): PhotoChoreographyRow[] => {
  if (!stills.length) {
    return [];
  }

  const includeLead = options.includeLead ?? true;
  const startIndex = options.startIndex ?? 0;
  const rows: PhotoChoreographyRow[] = [];
  let cursor = 0;

  if (includeLead) {
    rows.push({
      id: `row-lead-${stills[0].id}`,
      kind: 'lead',
      items: [makeItem(stills[0], startIndex)],
    });
    cursor = 1;
  }

  while (cursor < stills.length) {
    const current = stills[cursor];
    const next = stills[cursor + 1];
    const currentIndex = startIndex + cursor;

    if (!next) {
      rows.push({
        id: `row-single-${current.id}`,
        kind: 'single',
        items: [makeItem(current, currentIndex)],
      });
      cursor += 1;
      continue;
    }

    const nextIndex = startIndex + cursor + 1;

    if (isPortrait(current) && isPortrait(next)) {
      rows.push({
        id: `row-dual-${current.id}-${next.id}`,
        kind: 'dual-portrait',
        items: [makeItem(current, currentIndex), makeItem(next, nextIndex)],
      });
      cursor += 2;
      continue;
    }

    const isMixedPortraitPair =
      (isPortrait(current) && !isPortrait(next)) || (!isPortrait(current) && isPortrait(next));

    if (isMixedPortraitPair) {
      rows.push({
        id: `row-mixed-${current.id}-${next.id}`,
        kind: 'mixed',
        items: [makeItem(current, currentIndex), makeItem(next, nextIndex)],
      });
      cursor += 2;
      continue;
    }

    if (isLandscapeLike(current)) {
      rows.push({
        id: `row-full-${current.id}`,
        kind: 'full',
        items: [makeItem(current, currentIndex)],
      });
      cursor += 1;
      continue;
    }

    rows.push({
      id: `row-single-${current.id}`,
      kind: 'single',
      items: [makeItem(current, currentIndex)],
    });
    cursor += 1;
  }

  return rows;
};

export const formatStillNumber = (index: number): string => String(index + 1).padStart(2, '0');
