export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
}

export const socials: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@lakaaysha',
    url: 'https://instagram.com/lakaaysha',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@lakaaysha',
    url: 'https://www.tiktok.com/@lakaaysha',
  },
  {
    id: 'substack',
    label: 'Substack',
    handle: '@lakaaysha',
    url: 'https://substack.com/@lakaaysha',
  },
];
