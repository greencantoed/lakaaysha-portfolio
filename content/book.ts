/**
 * The writer side's editable facts. Update as the books move —
 * reads/votes/parts come from Wattpad, refresh them now and then.
 */

export interface Book {
  id: string;
  title: string;
  cover: string;
  coverAlt: string;
  status: 'live' | 'in-edit';
  format: string;
  year: string;
  blurb: string;
  tags: string[];
  url?: string;
  stats?: { reads: string; votes: string; parts: string; schedule: string };
  stamp: string;
}

export const books: Book[] = [
  {
    id: 'queerantine',
    title: 'Queerantine',
    cover: '/images/books/queerantine-cover.jpg',
    coverAlt: 'Queerantine cover — two women mid-kiss, drawn in warm crayon.',
    status: 'live',
    format: 'novel — serialized',
    year: '2026',
    blurb:
      'A sapphic lockdown romance in Amsterdam. Jill Wijntuin, spoken-word poet, hopelessly in love with her straight best friend — until her room floods and she ends up in her roommate’s bed.',
    tags: ['sapphic', 'amsterdam', 'slowburn', '18+'],
    url: 'https://www.wattpad.com/story/410398543-queerantine',
    stats: {
      reads: '7.5K',
      votes: '181',
      parts: '27',
      schedule: 'new chapters mon / wed / fri',
    },
    stamp: 'read it free',
  },
  {
    id: 'lovebombing',
    title: 'The Universe Is Lovebombing Me and I Don’t Have Anywhere to Go',
    cover: '/images/books/lovebombing-cover.jpg',
    coverAlt: 'Hot pink book cover with halftone portrait — The Universe Is Lovebombing Me and I Don’t Have Anywhere to Go.',
    status: 'in-edit',
    format: 'novel',
    year: 'soon',
    blurb: 'Written. Being edited. The universe will not let up.',
    tags: ['next'],
    stamp: 'in edit',
  },
];

export const firstReaderMailto =
  'mailto:lakaaysha@gmail.com?subject=First%20Reader%20—%20Lovebombing&body=I%20want%20to%20read%20it%20before%20the%20world%20does.';

export const helloMailto = 'mailto:lakaaysha@gmail.com?subject=Dear%20Lakaaysha';

export const wattpadProfile = 'https://www.wattpad.com/user/lakaaysha';
