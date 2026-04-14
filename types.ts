export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export type SiteTheme = 'signature';

export type StillOrientation = 'portrait' | 'landscape' | 'square';

export type HeroReelChapterId = 'wonder' | 'tension' | 'release';

export interface HeroReelChapter {
  id: HeroReelChapterId;
  label: string;
  start: number;
  end: number;
}

export interface HeroReelConfig {
  source: string;
  poster: string;
  clipDuration: number;
  chapters: HeroReelChapter[];
}

export interface FilmStill {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  orientation: StillOrientation;
  caption?: string;
  span?: 'wide' | 'tall' | 'normal';
}

export interface Project {
  id: string;
  title: string;
  year: string;
  format: string;
  crew: string;
  commissioner?: string;
  why?: string;
  stills: FilmStill[];
  status?: string;
  featured: boolean;
  inquiryTag: string;
  youtubeUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type CredibilityKind = 'festival' | 'press' | 'collab';

export interface CredibilityItem {
  id: string;
  label: string;
  kind: CredibilityKind;
  url?: string;
  logo?: string;
  coLogos?: string[];
  project?: 'general' | 'gen-c' | '7-plus-1';
  note?: string;
}

// Compatibility aliases during migration.
export type PortfolioItem = Project;
export type FilmProject = Project;

export interface GroundingSource {
  title: string;
  uri: string;
}
