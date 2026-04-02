import type { Locale } from './messages';

export type WorkHomeCardCopy = {
  title: string;
  desc: string;
  meta: string;
  imgAlt: string;
  /** Optional short line under title (motion cards) */
  lead?: string;
  /** e.g. "12 pieces" on the motion collection card */
  pieceCountBadge?: string;
};

const WORK = {
  hondaPrelude: {
    en: {
      title: 'Honda Prelude - Landing Page Concept',
      desc: 'A fictional landing page for the upcoming Honda Prelude, built as a UI challenge. Focused on bold typography, a dark automotive aesthetic, and spec highlights.',
      meta: 'UI Design · 2026',
      imgAlt: 'Honda Prelude landing page UI',
    },
    et: {
      title: 'Honda Prelude - maandumislehe kontseptsioon',
      desc: 'Fiktiivne maandumisleht tulevase Honda Prelude jaoks, valminud kasutajaliidese väljakutsena. Rõhk julgel tüpograafial, tumedal automeelel ja spetsifikatsiooni esiletõstmisel.',
      meta: 'Kasutajaliidese disain · 2026',
      imgAlt: 'Honda Prelude maandumislehe kasutajaliides',
    },
  },
  substrate: {
    en: {
      title: 'Substrate - Game Landing Page',
      desc: 'Landing page concept for a fictional psychological horror game. Designed the full page with countdown timer, gallery, and a story-driven layout.',
      meta: 'UI Design · Concept · 2026',
      imgAlt: 'Substrate game landing page',
    },
    et: {
      title: 'Substrate - mängu maandumisleht',
      desc: 'Fiktiivse psühholoogilise õudusmängu maandumislehe kontseptsioon: täisleht loenduri, galerii ja loojutustega paigutusega.',
      meta: 'Kasutajaliidese disain · Kontseptsioon · 2026',
      imgAlt: 'Substrate mängu maandumisleht',
    },
  },
  honeyBoot: {
    en: {
      title: 'HONEY//BOOT',
      desc: 'Web app that combines an FTP honeypot with an ESP32 firmware flasher. Built in 24 hours at the Cursor Hackathon (26 March 2026), with Gert Tali, Lukas Haavel, and Rivo Tüksammel. Live on Cloudflare Workers.',
      meta: 'Hackathon · Security / IoT · 2026',
      imgAlt: 'HONEY//BOOT ESP32 flasher UI',
    },
    et: {
      title: 'HONEY//BOOT',
      desc: 'Veebirakendus, mis ühendab FTP honeypoti ja ESP32 püsivara flashija. Valmis 24 tunniga Cursor Hackathonil (26. märts 2026) koos Gert Tali, Lukas Haaveli ja Rivo Tüksammeliga. Juures Cloudflare Workersis.',
      meta: 'Hackathon · Turvalisus / IoT · 2026',
      imgAlt: 'HONEY//BOOT ESP32 flashija kasutajaliides',
    },
  },
  freeGamesExplorer: {
    en: {
      title: 'Free Games Explorer',
      desc: 'Web app for discovering free-to-play games: search, platform and genre filters, favourites, and keyboard shortcuts. Neo-brutalist UI. School assignment for EKA. Live on GitHub Pages.',
      meta: 'Web app · EKA · 2026',
      imgAlt: 'Free Games Explorer app screenshot',
    },
    et: {
      title: 'Free Games Explorer',
      desc: 'Veebirakendus tasuta mängude avastamiseks: otsing, platvormi- ja žanrifiltrid, lemmikud ja kiirklahvid. Neo-brutalistlik kasutajaliides. Koolitöö EKA jaoks. Juures GitHub Pagesis.',
      meta: 'Veebirakendus · EKA · 2026',
      imgAlt: 'Free Games Exploreri rakenduse kuvatõmmis',
    },
  },
  selfCareTracker: {
    en: {
      title: 'Päevaplaan — Self-care tracker',
      desc: 'Web app for habits and self-care: quick-add tasks, categories, streaks, achievements, and light gamification (including a draggable plant). Estonian-first UI with local storage. School assignment for EKA. Live on GitHub Pages.',
      meta: 'Web app · EKA · 2026',
      imgAlt: 'Päevaplaan self-care tracker app screenshot',
    },
    et: {
      title: 'Päevaplaan — enesehoolduse jälgija',
      desc: 'Veebirakendus harjumuste ja enesehoolduse planeerimiseks: kiire ülesannete lisamine, kategooriad, streak, saavutused ja kerge mängustamine (sh lohistatav taim). Eestikeelne liides ja brauseri kohalik salvestus. Koolitöö EKA jaoks. Juures GitHub Pagesis.',
      meta: 'Veebirakendus · EKA · 2026',
      imgAlt: 'Päevaplaani rakenduse kuvatõmmis',
    },
  },
  pulse: {
    en: {
      title: 'Pulse - Team Wellness App',
      desc: 'Full landing page design for Pulse, a concept SaaS app that tracks team mood through anonymous monthly surveys. Features AI-powered recommendations, dashboard UI, pricing, and a custom mascot.',
      meta: 'Product Design · Full Landing Page · 2025',
      imgAlt: 'Pulse app hero section',
    },
    et: {
      title: 'Pulse - meeskonna heaolu rakendus',
      desc: 'Täismahus maandumislehe disain Pulse’ile, kontseptsioonilisele SaaS-ile, mis jälgib meeskonna tuju anonüümsete kuu-uuringute kaudu. AI-põhised soovitused, armatuurlaua UI, hinnakiri ja maskott.',
      meta: 'Tootedisain · Täisleht · 2025',
      imgAlt: 'Pulse rakenduse hero plokk',
    },
  },
  catweesSuv: {
    en: {
      title: 'Catwees Honda - SUV Lineup Banner',
      desc: 'Web banner for Catwees, a Honda and Opel dealership in Estonia. Showcased their full electric and hybrid SUV range with a bold dark blue and neon glow look.',
      meta: 'Graphic Design · Client Work · 2023',
      imgAlt: 'Honda SUV lineup banner for Catwees',
    },
    et: {
      title: 'Catwees Honda - SUV-valiku bänner',
      desc: 'Veeb bänner Catweesile, Honda ja Opel edasimüüjale Eestis. Elektri- ja hübriid-SUV valik julge tumesinise ja neoonkuma toonis.',
      meta: 'Graafiline disain · Klienttöö · 2023',
      imgAlt: 'Honda SUV-valiku bänner Catweesile',
    },
  },
  civic50: {
    en: {
      title: 'Honda Civic 50th Anniversary',
      desc: 'A timeline poster tracing every generation of the Honda Civic from 1972 to 2022. Made for the Catwees dealership to celebrate the Civic e:HEV launch.',
      meta: 'Graphic Design · Client Work · 2022',
      imgAlt: 'Honda Civic 50th anniversary timeline poster',
    },
    et: {
      title: 'Honda Civic 50. juubel',
      desc: 'Ajakujunduse plakat kõigi Honda Civic põlvkondadega aastatel 1972-2022. Valmistatud Catwees edasimüüjale Civic e:HEV turuletoomiseks.',
      meta: 'Graafiline disain · Klienttöö · 2022',
      imgAlt: 'Honda Civic 50. juubeli ajajoon plakatil',
    },
  },
  catweesBrandAnim: {
    en: {
      title: 'Catwees - Brand animation',
      desc: 'Looping brand animation for Catwees, a Honda and Opel dealership in Estonia - logo and wordmark motion for the website, newsletters, and social posts.',
      meta: 'Motion · Catwees · Feb 2022',
      imgAlt: 'Catwees brand animation',
      lead: 'Logo and wordmark motion for the dealership’s digital channels.',
    },
    et: {
      title: 'Catwees - brändi animatsioon',
      desc: 'Korduv brändi animatsioon Catweesile, Honda ja Opel edasimüüjale Eestis - logo ja sõnamärgi liikumine kodulehel, uudiskirjades ja sotsiaalmeedias.',
      meta: 'Liikuv graafika · Catwees · veebr 2022',
      imgAlt: 'Catwees brändi animatsioon',
      lead: 'Logo ja sõnamärgi liikumine edasimüüja digikanalites.',
    },
  },
  catweesMotionCollection: {
    en: {
      title: 'Catwees Honda — Motion Collection',
      desc: '12 motion pieces across social ads, email headers, campaign GIFs, and product loops for an Estonian Honda dealership.',
      meta: 'Motion · Catwees · 2021–2023',
      imgAlt: 'Grid preview of Catwees Honda motion work',
      pieceCountBadge: '12 pieces',
    },
    et: {
      title: 'Catwees Honda — liikuva graafika kogu',
      desc: '12 liikuvat tööd: sotsiaalreklaamid, e-kirjade päised, kampaania-GIFid ja tootetsüklid Eesti Honda edasimüüjale.',
      meta: 'Liikuv graafika · Catwees · 2021–2023',
      imgAlt: 'Catwees Honda liikuva graafika eelvaate ruudustik',
      pieceCountBadge: '12 tööd',
    },
  },
  crvMotion: {
    en: {
      title: 'Honda CR-V - Motion loop',
      desc: 'Short motion loops for the Honda CR-V, built for Catwees social and display placements.',
      meta: 'Motion · Catwees · Oct 2023',
      imgAlt: 'Honda CR-V motion',
      lead: 'Animated showcase of the CR-V for Catwees online ads and feeds.',
    },
    et: {
      title: 'Honda CR-V - liikuv tsükkel',
      desc: 'Lühikesed liikuvad tsüklid Honda CR-V jaoks Catweesi sotsiaal- ja bännerpaigutustesse.',
      meta: 'Liikuv graafika · Catwees · okt 2023',
      imgAlt: 'Honda CR-V liikuv graafika',
      lead: 'CR-V animatsioon Catweesi veebireklaamide ja voogude jaoks.',
    },
  },
  eny1Motion: {
    en: {
      title: 'Honda e:Ny1 - Motion loop',
      desc: 'Motion clip highlighting the Honda e:Ny1 electric SUV for Catwees marketing.',
      meta: 'Motion · Catwees · Oct 2023',
      imgAlt: 'Honda e:Ny1 motion',
      lead: 'EV-focused animation for social and digital screens.',
    },
    et: {
      title: 'Honda e:Ny1 - liikuv tsükkel',
      desc: 'Liikuv klipp Honda e:Ny1 elektri-SUV esiletõstmiseks Catweesi turunduses.',
      meta: 'Liikuv graafika · Catwees · okt 2023',
      imgAlt: 'Honda e:Ny1 liikuv graafika',
      lead: 'Elektriauto fookusega animatsioon sotsiaalmeedia ja ekraanide jaoks.',
    },
  },
  zrvMotion: {
    en: {
      title: 'Honda ZR-V - Motion loop',
      desc: 'Motion piece for the Honda ZR-V crossover, produced for Catwees campaigns.',
      meta: 'Motion · Catwees · Oct 2023',
      imgAlt: 'Honda ZR-V motion',
      lead: 'Loopable creative for the ZR-V launch push.',
    },
    et: {
      title: 'Honda ZR-V - liikuv tsükkel',
      desc: 'Liikuv töö Honda ZR-V crossoveri jaoks Catweesi kampaaniate jaoks.',
      meta: 'Liikuv graafika · Catwees · okt 2023',
      imgAlt: 'Honda ZR-V liikuv graafika',
      lead: 'Korduv kreatiiv ZR-V turuletoomise kampaaniale.',
    },
  },
  catweesHomeBanner: {
    en: {
      title: 'Catwees - Homepage banner',
      desc: 'Animated hero banner for the Catwees website - layered car imagery and typography timed for the homepage header.',
      meta: 'Motion · Catwees · Feb 2023',
      imgAlt: 'Catwees website banner animation',
      lead: 'Full-width animated banner for the dealership site.',
    },
    et: {
      title: 'Catwees - kodulehe bänner',
      desc: 'Animeeritud hero-bänner Catweesi kodulehel - kihiline auto pilt ja tüpograafia ajastatud avalehe päisesse.',
      meta: 'Liikuv graafika · Catwees · veebr 2023',
      imgAlt: 'Catweesi kodulehe bänneri animatsioon',
      lead: 'Täislaiune animeeritud bänner edasimüüja saidile.',
    },
  },
  kuubik: {
    en: {
      title: 'Kuubik - 3D cube motion',
      desc: 'Abstract cube transformation - motion study and social-ready clip for Catwees.',
      meta: 'Motion · Catwees · Dec 2022',
      imgAlt: 'Cube motion study',
      lead: 'Geometric animation for feeds and experiments.',
    },
    et: {
      title: 'Kuubik - 3D kuubi liikumine',
      desc: 'Abstraktne kuubi teisendus - liikumisuuring ja sotsiaalmeediaks sobiv klipp Catweesile.',
      meta: 'Liikuv graafika · Catwees · dets 2022',
      imgAlt: 'Kuubi liikumisuuring',
      lead: 'Geomeetriline animatsioon voogude ja katsete jaoks.',
    },
  },
  catweesComposite: {
    en: {
      title: 'Catwees - Composite motion',
      desc: 'After Effects composite export - layered graphics, glow, and transitions for a Catwees digital piece.',
      meta: 'Motion · Catwees · Dec 2022',
      imgAlt: 'Catwees composite motion',
      lead: 'Full AE comp export with automotive styling and effects.',
    },
    et: {
      title: 'Catwees - komposiit-liikumine',
      desc: 'After Effects komposiidi eksport - kihiline graafika, sära ja üleminekud Catweesi digimaterjalile.',
      meta: 'Liikuv graafika · Catwees · dets 2022',
      imgAlt: 'Catweesi komposiit animatsioon',
      lead: 'Täielik AE komposiit automaatmeele ja efektidega.',
    },
  },
  detailingGif: {
    en: {
      title: 'Detailing - Social GIF',
      desc: 'GIF for Catwees detailing / polish services - quick loop for social stories and posts.',
      meta: 'Motion · Catwees · Jun 2022',
      imgAlt: 'Car polishing service animation',
      lead: 'Short loop promoting polish and care services.',
    },
    et: {
      title: 'Poleerimine - sotsiaal-GIF',
      desc: 'GIF Catweesi poleerimis- ja hooldusteenuste jaoks - kiire tsükkel lugude ja postituste jaoks.',
      meta: 'Liikuv graafika · Catwees · juuni 2022',
      imgAlt: 'Auto poleerimise teenuse animatsioon',
      lead: 'Lühike tsükkel poleerimis- ja hooldusteenuste tutvustuseks.',
    },
  },
  hrvEmailHeader: {
    en: {
      title: 'HR-V - Email header',
      desc: 'Animated header graphic for a Honda HR-V client email send, branded for Catwees.',
      meta: 'Motion · Catwees · Mar 2022',
      imgAlt: 'Honda HR-V email header animation',
      lead: 'Animated top banner for a customer email campaign.',
    },
    et: {
      title: 'HR-V - e-kirja päis',
      desc: 'Animeeritud päisegraafika Honda HR-V kliendikirja jaoks, Catweesi brändiga.',
      meta: 'Liikuv graafika · Catwees · märts 2022',
      imgAlt: 'Honda HR-V e-kirja päise animatsioon',
      lead: 'Animeeritud üla-bänner kliendikampaania e-kirjadele.',
    },
  },
  sinimustvalgeFb: {
    en: {
      title: 'Sinimustvalge - Facebook clip',
      desc: 'Facebook motion clip using Estonian blue-black-white tones for a Catwees national-day style post.',
      meta: 'Motion · Catwees · Feb 2022',
      imgAlt: 'Sinimustvalge Facebook motion',
      lead: 'Flag-inspired motion for a social post.',
    },
    et: {
      title: 'Sinimustvalge - Facebooki klipp',
      desc: 'Facebooki liikuv klipp Eesti sinimustvalgete toonidega Catweesi riigipühale sarnase postituse jaoks.',
      meta: 'Liikuv graafika · Catwees · veebr 2022',
      imgAlt: 'Sinimustvalge Facebooki liikuv graafika',
      lead: 'Lipust inspireeritud liikumine sotsiaalpostituseks.',
    },
  },
  newsletterLogo: {
    en: {
      title: 'Newsletter - Logo animation',
      desc: 'Looping Catwees logo animation sized for newsletter and email mastheads.',
      meta: 'Motion · Catwees · Feb 2022',
      imgAlt: 'Catwees email logo animation',
      lead: 'Masthead loop for Catwees mailings.',
    },
    et: {
      title: 'Uudiskiri - logo animatsioon',
      desc: 'Korduv Catweesi logo animatsioon uudiskirja ja e-kirja päiste jaoks.',
      meta: 'Liikuv graafika · Catwees · veebr 2022',
      imgAlt: 'Catweesi e-kirja logo animatsioon',
      lead: 'Päise tsükkel Catweesi kirjastuste jaoks.',
    },
  },
  christmasCard: {
    en: {
      title: 'Christmas card - Animation',
      desc: 'Animated Christmas card for Catwees - seasonal greeting for clients and social.',
      meta: 'Motion · Catwees · Dec 2021',
      imgAlt: 'Christmas card animation',
      lead: 'Holiday loop for end-of-year outreach.',
    },
    et: {
      title: 'Jõulukaart - animatsioon',
      desc: 'Animeeritud jõulukaart Catweesile - hooajaline tervitus klientidele ja sotsiaalmeediale.',
      meta: 'Liikuv graafika · Catwees · dets 2021',
      imgAlt: 'Jõulukaardi animatsioon',
      lead: 'Pühade tsükkel aasta lõpu tervitusteks.',
    },
  },
  urbanSuvGif: {
    en: {
      title: 'Urban SUV - Campaign GIF',
      desc: 'GIF promoting a city-friendly SUV line - campaign motion for Catwees feeds.',
      meta: 'Motion · Catwees · Dec 2021',
      imgAlt: 'Urban SUV campaign GIF',
      lead: 'Quick animation for a compact SUV message.',
    },
    et: {
      title: 'Linnamaastur - kampaania GIF',
      desc: 'GIF linnasõbraliku SUV-seeria jaoks - kampaania liikuv graafika Catweesi voogude jaoks.',
      meta: 'Liikuv graafika · Catwees · dets 2021',
      imgAlt: 'Linnamaasturi kampaania GIF',
      lead: 'Kiire animatsioon kompaktse SUV sõnumi jaoks.',
    },
  },
  afterHoursPoster: {
    en: {
      title: 'After Hours - Album Poster',
      desc: "Fan-made poster for The Weeknd's After Hours album. Designed with warm bokeh tones, tracklist layout, and Spotify code integration.",
      meta: 'Poster Design · Personal · 2024',
      imgAlt: 'The Weeknd After Hours album poster',
    },
    et: {
      title: 'After Hours - albumi plakat',
      desc: 'Fännplakat The Weekndi albumile „After Hours”. Soe bokeh-toon, lugude loend ja Spotify koodi lõiming.',
      meta: 'Plakatidisain · Isiklik · 2024',
      imgAlt: 'The Weekndi After Hours albumi plakat',
    },
  },
} as const satisfies Record<string, Record<Locale, WorkHomeCardCopy>>;

export type WorkHomeCardId = keyof typeof WORK;

export function workHomeCard(locale: Locale, id: WorkHomeCardId): WorkHomeCardCopy {
  return WORK[id][locale];
}

export function workHomeCards(locale: Locale): Record<WorkHomeCardId, WorkHomeCardCopy> {
  return {
    hondaPrelude: WORK.hondaPrelude[locale],
    substrate: WORK.substrate[locale],
    honeyBoot: WORK.honeyBoot[locale],
    freeGamesExplorer: WORK.freeGamesExplorer[locale],
    selfCareTracker: WORK.selfCareTracker[locale],
    pulse: WORK.pulse[locale],
    catweesSuv: WORK.catweesSuv[locale],
    civic50: WORK.civic50[locale],
    catweesBrandAnim: WORK.catweesBrandAnim[locale],
    catweesMotionCollection: WORK.catweesMotionCollection[locale],
    crvMotion: WORK.crvMotion[locale],
    eny1Motion: WORK.eny1Motion[locale],
    zrvMotion: WORK.zrvMotion[locale],
    catweesHomeBanner: WORK.catweesHomeBanner[locale],
    kuubik: WORK.kuubik[locale],
    catweesComposite: WORK.catweesComposite[locale],
    detailingGif: WORK.detailingGif[locale],
    hrvEmailHeader: WORK.hrvEmailHeader[locale],
    sinimustvalgeFb: WORK.sinimustvalgeFb[locale],
    newsletterLogo: WORK.newsletterLogo[locale],
    christmasCard: WORK.christmasCard[locale],
    urbanSuvGif: WORK.urbanSuvGif[locale],
    afterHoursPoster: WORK.afterHoursPoster[locale],
  };
}
