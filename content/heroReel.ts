import type { HeroReelChapter, HeroReelConfig } from '../types';

export interface HeroReelSelection {
  chapter: HeroReelChapter;
  clipStart: number;
  clipEnd: number;
  clipDuration: number;
}

const chapters: HeroReelChapter[] = [
  { id: 'wonder', label: 'Wonder', start: 0, end: 18 },
  { id: 'tension', label: 'Tension', start: 18, end: 42 },
  { id: 'release', label: 'Release', start: 42, end: 58 },
];

export const heroReelConfig: HeroReelConfig = {
  source: '/images/human-vs-human/reel_v4_match_chaptered_silent_1080p24.mp4',
  poster: '/images/human-vs-human/7+1_still_1.webp',
  clipDuration: 7,
  chapters,
};

let cachedSelection: HeroReelSelection | null = null;

const randomBetween = (min: number, max: number): number => {
  if (max <= min) {
    return min;
  }

  return min + Math.random() * (max - min);
};

export const getHeroReelSelection = (): HeroReelSelection => {
  if (cachedSelection) {
    return cachedSelection;
  }

  const chapter = heroReelConfig.chapters[Math.floor(Math.random() * heroReelConfig.chapters.length)];
  const chapterDuration = Math.max(0.75, chapter.end - chapter.start);
  const clipDuration = Math.min(heroReelConfig.clipDuration, chapterDuration);
  const maxStart = chapter.end - clipDuration;
  const clipStart = Number(randomBetween(chapter.start, maxStart).toFixed(3));
  const clipEnd = Number((clipStart + clipDuration).toFixed(3));

  cachedSelection = {
    chapter,
    clipStart,
    clipEnd,
    clipDuration,
  };

  return cachedSelection;
};

