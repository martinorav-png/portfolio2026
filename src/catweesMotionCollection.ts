import type { WorkHomeCardId } from './workHomeLocale';

/** Motion pieces rolled into the Catwees Honda collection (brand animation is separate). */
export const CATWEES_MOTION_COLLECTION_IDS = [
  'crvMotion',
  'eny1Motion',
  'zrvMotion',
  'catweesHomeBanner',
  'kuubik',
  'catweesComposite',
  'detailingGif',
  'hrvEmailHeader',
  'sinimustvalgeFb',
  'newsletterLogo',
  'christmasCard',
  'urbanSuvGif',
] as const satisfies readonly WorkHomeCardId[];

export type CatweesMotionCollectionItemId = (typeof CATWEES_MOTION_COLLECTION_IDS)[number];

export type MotionItemMedia =
  | { kind: 'video'; src: string }
  | { kind: 'image'; src: string };

export const MOTION_ITEM_MEDIA: Record<CatweesMotionCollectionItemId, MotionItemMedia> = {
  crvMotion: { kind: 'video', src: '/assets/works/catwees/crv-2.mp4' },
  eny1Motion: { kind: 'video', src: '/assets/works/catwees/eny1-2.mp4' },
  zrvMotion: { kind: 'video', src: '/assets/works/catwees/zrv-2.mp4' },
  catweesHomeBanner: { kind: 'image', src: '/assets/works/catwees/kodulehe-banner-3.gif' },
  kuubik: { kind: 'video', src: '/assets/works/catwees/kuubik.mp4' },
  catweesComposite: { kind: 'image', src: '/assets/works/catwees/comp-1.gif' },
  detailingGif: { kind: 'image', src: '/assets/works/catwees/poleerimine.gif' },
  hrvEmailHeader: { kind: 'image', src: '/assets/works/catwees/hrv-kliendimeil-2.gif' },
  sinimustvalgeFb: { kind: 'video', src: '/assets/works/catwees/sinimustvalge-fb.mp4' },
  newsletterLogo: { kind: 'image', src: '/assets/works/catwees/meilipealislogo.gif' },
  christmasCard: { kind: 'image', src: '/assets/works/catwees/joulukaart-6.gif' },
  urbanSuvGif: { kind: 'image', src: '/assets/works/catwees/sobivlinnamaastur.gif' },
};

/** First six pieces for the 3×2 preview collage on the collection card. */
export const MOTION_COLLECTION_PREVIEW_IDS: readonly CatweesMotionCollectionItemId[] = [
  'crvMotion',
  'eny1Motion',
  'zrvMotion',
  'catweesHomeBanner',
  'catweesComposite',
  'detailingGif',
];
