import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

const ASCIIText = lazy(() => import('./components/ASCIIText'));
import BounceCards from './components/BounceCards';
import HeroBackground from './HeroBackground';
import { initSiteEffects } from './site-effects';
import { useAppPreferences } from './ThemeLanguageContext';
import GlobalClickSpark from './components/GlobalClickSpark';
import Folder from './components/Folder';
import CatweesMotionCollectionCard from './components/CatweesMotionCollectionCard';
import WorkTimeline, { type TLEntry } from './components/WorkTimeline';
import SkillsStrip from './components/SkillsStrip';
import ProfileCard from './components/ProfileCard';
import BioPortrait from './components/BioPortrait';
import HeroBubbleCtas from './components/HeroBubbleCtas';
import { useBioHoloLayout } from './useBioHoloLayout';
import { workHomeCards } from './workHomeLocale';
import { messages } from './messages';

const CONTACT_EMAIL = 'martinoravdisain@gmail.com';
/** Opens Gmail compose in the browser - avoids broken `mailto:` when Chrome is the default handler. */
const CONTACT_GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`;
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Favicon used as holo mask pattern on the about ProfileCard */
const SITE_ICON_PATTERN_URL = '/favicon.png';

/** Public folder portrait — respect Vite base path so deploys not at domain root still resolve */
const BIO_PORTRAIT_URL = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}assets/martin-portrait.png`;

const HERO_IMAGE_POOL = [
  '/assets/works/honda-prelude-ui.jpg',
  '/assets/works/good-am-poster.jpg',
  '/assets/works/pulse-hero.jpg',
  '/assets/works/divinely-uninspired-poster.jpg',
  '/assets/works/substrate-game.jpg',
  '/assets/works/honda-suv-lineup.jpg',
  '/assets/works/civic-50th.jpg',
  '/assets/works/after-hours-poster.jpg',
  '/assets/works/civic-fb-banner.jpg',
  '/assets/works/japanese-flavors-email.jpg',
  '/assets/works/marshall-mathers-poster.jpg',
  '/assets/works/faces-poster.jpg',
  '/assets/works/broken-by-desire-poster.jpg',
  '/assets/works/young-forever-poster.jpg',
  '/assets/works/pretty-poison-poster.jpg',
  '/assets/works/fallout-poster.jpg',
  '/assets/works/mpr-emblem-photo.png',
  '/assets/works/swimming-poster.jpg',
  '/assets/works/honey-boot.png',
] as const;

/** Extra work thumbs for the folder widget — JPEGs/PNGs only; GIFs are
 *  excluded here because they are 2–45 MB each and would blow up the home
 *  page payload if randomly selected. They are shown on the work page. */
const WORK_FOLDER_THUMB_POOL = [
  ...HERO_IMAGE_POOL,
  '/assets/works/pulse-landing-full.jpg',
] as const;

function hslToHex(h: number, s: number, l: number): string {
  const s1 = s / 100;
  const l1 = l / 100;
  const a = s1 * Math.min(l1, 1 - l1);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l1 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomFolderColor(): string {
  return hslToHex(Math.random() * 360, 50 + Math.random() * 38, 36 + Math.random() * 24);
}

/** Holo / glow accents for ProfileCard — new palette on each full page load. */
function randomBioProfileCardStyle(): CSSProperties {
  const h0 = Math.random() * 360;
  const sat = 56 + Math.random() * 26;
  const lit = 50 + Math.random() * 16;
  const hsl = (degOffset: number) => {
    const h = (h0 + degOffset) % 360;
    return `hsl(${Math.round(h)}, ${Math.round(sat)}%, ${Math.round(lit)}%)`;
  };
  const h0r = Math.round(h0);
  const h1 = Math.round((h0 + 118) % 360);
  const hg = Math.round((h0 + 48) % 360);
  return {
    '--sunpillar-1': hsl(0),
    '--sunpillar-2': hsl(52),
    '--sunpillar-3': hsl(104),
    '--sunpillar-4': hsl(156),
    '--sunpillar-5': hsl(208),
    '--sunpillar-6': hsl(260),
    '--inner-gradient': `linear-gradient(145deg, hsla(${h0r}, 42%, 24%, 0.5) 0%, hsla(${h1}, 48%, 34%, 0.4) 100%)`,
    '--behind-glow-color': `hsla(${hg}, 52%, 44%, 0.34)`,
  } as CSSProperties;
}

function pickRandomUnique<T>(arr: readonly T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, count);
}

const HERO_BOUNCE_TRANSFORMS = [
  'rotate(5deg) translate(-120px, 4px)',
  'rotate(0deg) translate(-50px, -2px)',
  'rotate(-5deg) translate(50px, 6px)',
  'rotate(5deg) translate(120px, 0px)',
];

export default function App() {
  const { theme, toggleTheme, locale, setLocale, t } = useAppPreferences();
  /** Full-viewport click sparks use capture-phase pointerdown; skip on touch-primary devices. */
  const [showGlobalClickSpark, setShowGlobalClickSpark] = useState(false);
  const [heroFeatureImages] = useState(() => pickRandomUnique(HERO_IMAGE_POOL, 4));
  const [workFolderRoll] = useState(() => ({
    color: randomFolderColor(),
    thumbs: pickRandomUnique(WORK_FOLDER_THUMB_POOL, 3),
  }));
  const [bioProfileCardStyle] = useState(() => randomBioProfileCardStyle());
  const showBioHolo = useBioHoloLayout();

  const tRef = useRef(t);
  tRef.current = t;

  const wh = useMemo(() => workHomeCards(locale), [locale]);

  const timelineItems = useMemo<TLEntry[]>(() => [
    {
      id: 'pulse',
      year: '2026',
      title: wh.pulse.title,
      meta: wh.pulse.meta,
      desc: wh.pulse.desc,
      imgSrc: '/assets/works/pulse-hero.jpg',
      imgAlt: wh.pulse.imgAlt,
      liveUrl: 'https://martinorav-png.github.io/pulse-UI',
    },
    {
      id: 'honeyBoot',
      year: '2026',
      title: wh.honeyBoot.title,
      meta: wh.honeyBoot.meta,
      desc: wh.honeyBoot.desc,
      imgSrc: '/assets/works/honey-boot.png',
      imgAlt: wh.honeyBoot.imgAlt,
      liveUrl: 'https://honey-boot.rivo-tuksammel.workers.dev',
    },
    {
      id: 'substrate',
      year: '2026',
      title: wh.substrate.title,
      meta: wh.substrate.meta,
      desc: wh.substrate.desc,
      imgSrc: '/assets/works/substrate-game.jpg',
      imgAlt: wh.substrate.imgAlt,
    },
    {
      id: 'hondaPrelude',
      year: '2026',
      title: wh.hondaPrelude.title,
      meta: wh.hondaPrelude.meta,
      desc: wh.hondaPrelude.desc,
      imgSrc: '/assets/works/honda-prelude-ui.jpg',
      imgAlt: wh.hondaPrelude.imgAlt,
    },
    {
      id: 'freeGamesExplorer',
      year: '2025',
      title: wh.freeGamesExplorer.title,
      meta: wh.freeGamesExplorer.meta,
      desc: wh.freeGamesExplorer.desc,
      imgSrc: '/assets/works/free-games-explorer-thumb.png',
      imgAlt: wh.freeGamesExplorer.imgAlt,
      liveUrl: 'https://martinorav-png.github.io/free-games-explorer/',
    },
    {
      id: 'selfCareTracker',
      year: '2025',
      title: wh.selfCareTracker.title,
      meta: wh.selfCareTracker.meta,
      desc: wh.selfCareTracker.desc,
      imgSrc: '/assets/works/self-care-tracker-thumb.png',
      imgAlt: wh.selfCareTracker.imgAlt,
      liveUrl: 'https://martinorav-png.github.io/self-care-tracker/',
    },
    {
      id: 'catweesSuv',
      year: '2023',
      title: wh.catweesSuv.title,
      meta: wh.catweesSuv.meta,
      desc: wh.catweesSuv.desc,
      imgSrc: '/assets/works/honda-suv-lineup.jpg',
      imgAlt: wh.catweesSuv.imgAlt,
    },
    {
      id: 'civic50',
      year: '2022',
      title: wh.civic50.title,
      meta: wh.civic50.meta,
      desc: wh.civic50.desc,
      imgSrc: '/assets/works/civic-50th.jpg',
      imgAlt: wh.civic50.imgAlt,
    },
    {
      id: 'catweesBrandAnim',
      year: '2022',
      title: wh.catweesBrandAnim.title,
      meta: wh.catweesBrandAnim.meta,
      desc: wh.catweesBrandAnim.desc,
      videoSrc: '/assets/works/catwees/catwees-animation.mp4',
      imgAlt: wh.catweesBrandAnim.imgAlt,
    },
    {
      id: 'catweesMotionCollection',
      year: '2021',
      title: wh.catweesMotionCollection.title,
      meta: wh.catweesMotionCollection.meta,
      desc: wh.catweesMotionCollection.desc,
      renderCard: () => <CatweesMotionCollectionCard locale={locale} noReveal />,
    },
  ], [wh, locale]);

  const heroBubbleItems = useMemo(() => {
    const m = messages[locale];
    return [
      {
        href: '#work',
        label: m.heroCtaWork,
        ariaLabel: m.heroCtaWork,
        rotation: -5,
        hoverStyles:
          theme === 'dark'
            ? { bgColor: '#e8e4dc', textColor: '#121214' }
            : { bgColor: '#1a1a1a', textColor: '#faf9f7' },
      },
      {
        href: '#contact',
        label: m.heroCtaContact,
        ariaLabel: m.heroCtaContact,
        rotation: 5,
        hoverStyles:
          theme === 'dark'
            ? { bgColor: '#3b82f6', textColor: '#ffffff' }
            : { bgColor: '#2563eb', textColor: '#ffffff' },
      },
    ];
  }, [locale, theme]);

  useEffect(() => {
    try {
      return initSiteEffects({
        getModalStrings: () => ({ modalViewLive: tRef.current('modalViewLive') }),
      });
    } catch (e) {
      console.error('initSiteEffects failed:', e);
      return undefined;
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setShowGlobalClickSpark(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <>
      {showGlobalClickSpark ? <GlobalClickSpark /> : null}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            martin.orav
          </a>
          <div className="nav-right">
            <div className="nav-links">
              <a href="/">{t('navHome')}</a>
              <a href="/work.html">{t('navWork')}</a>
              <a href="#about">{t('navAbout')}</a>
              <a href="#skills">{t('navSkills')}</a>
              <a href="#contact">{t('navContact')}</a>
            </div>
            <div className="nav-controls">
              <div className="lang-switch" role="group" aria-label={t('langSwitch')}>
                <button
                  type="button"
                  className={`lang-switch-btn${locale === 'en' ? ' is-active' : ''}`}
                  onClick={() => setLocale('en')}
                  aria-pressed={locale === 'en'}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`lang-switch-btn${locale === 'et' ? ' is-active' : ''}`}
                  onClick={() => setLocale('et')}
                  aria-pressed={locale === 'et'}
                >
                  ET
                </button>
              </div>
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? t('themeToLight') : t('themeToDark')}
              >
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className={`hero ${theme === 'dark' ? 'hero--dither' : 'hero--ballpit'}`}>
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <HeroBackground theme={theme} />
        <div className="hero-dots" />
        <div className="hero-grain" />

        <div className="hero-content">
          <p className="hero-label anim-fade-up">
            <span className="prism-text">{t('heroHey')}</span>
          </p>
          <div className="hero-headline-safe">
            <div className="ascii-name-container anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <Suspense fallback={null}>
                <ASCIIText
                  text="Martin"
                  enableWaves
                  asciiFontSize={10}
                  textFontSize={300}
                  planeBaseHeight={13}
                  textColor="#fdf9f3"
                />
              </Suspense>
            </div>
            <p className="hero-subtitle anim-fade-up" style={{ animationDelay: '0.2s' }}>
              {t('heroSubtitle')}
            </p>
          </div>
          <div className="hero-cta hero-cta--bubble anim-fade-up" style={{ animationDelay: '0.35s' }}>
            <HeroBubbleCtas items={heroBubbleItems} />
          </div>
        </div>

        <div className="hero-previews hero-previews--bounce anim-fade-up" style={{ animationDelay: '0.5s' }}>
          <BounceCards
            className="hero-bounce-cards"
            images={[...heroFeatureImages]}
            containerWidth={520}
            containerHeight={250}
            animationDelay={0.85}
            animationStagger={0.08}
            easeType="elastic.out(1, 0.5)"
            transformStyles={[...HERO_BOUNCE_TRANSFORMS]}
            enableHover
            imageLoading="eager"
          />
        </div>
        <div className="hero-scroll-hint anim-fade-up" style={{ animationDelay: '0.7s' }}>
          <div className="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      <section className="section bio-section" id="about">
        <div className="container">
          <h2 className="section-title reveal">{t('bioTitle')}</h2>
          <div className="bio-grid reveal">
            <div className="bio-text">
              <p>{t('bioP1')}</p>
              <p>{t('bioP2')}</p>
              <p className="bio-closing">{t('bioP3')}</p>
            </div>
            {showBioHolo ? (
              <figure className="bio-photo" aria-label={t('bioPhotoAlt')}>
                <ProfileCard
                  className="bio-profile-card"
                  bioVariant
                  style={bioProfileCardStyle}
                  avatarUrl={BIO_PORTRAIT_URL}
                  iconUrl={SITE_ICON_PATTERN_URL}
                  grainUrl=""
                  name={t('bioName')}
                  title={t('bioProfileTitle')}
                  showUserInfo={false}
                />
              </figure>
            ) : (
              <BioPortrait
                imageSrc={BIO_PORTRAIT_URL}
                imageAlt={t('bioPhotoAlt')}
                name={t('bioName')}
                title={t('bioProfileTitle')}
              />
            )}
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="container">
          <h2 className="section-title reveal">{t('workTitle')}</h2>
          <p className="section-subtitle reveal">{t('workSubtitle')}</p>

          <WorkTimeline items={timelineItems} />

          <div className="work-cta-row reveal">
            <div className="work-cta-arrow-hint">
              <p className="work-cta-arrow-text">{t('workFolderPreviewCue')}</p>
              <img
                src="/assets/folder-preview-arrow.png"
                alt=""
                className="work-cta-arrow-img"
                width={130}
                height={130}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="work-cta-folder-wrap" title={t('workFolderHint')}>
              <div className="work-cta-folder-stage">
                <div className="work-cta-folder-mount">
                  <Folder
                    clickOnly
                    size={2}
                    color={workFolderRoll.color}
                    items={workFolderRoll.thumbs.map((src) => (
                      <img key={src} src={src} alt="" className="folder-paper-thumb" loading="lazy" />
                    ))}
                  />
                </div>
              </div>
            </div>
            <div className="work-cta-actions">
              <a href="/work.html" className="btn btn-primary">
                {t('viewAllWork')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark" id="skills">
        <div className="container">
          <h2 className="section-title reveal">{t('skillsTitle')}</h2>
          <SkillsStrip />
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-container">
          <h2 className="section-title reveal">{t('contactTitle')}</h2>
          <p className="section-subtitle reveal">{t('contactSubtitle')}</p>
          <div className="contact-links reveal">
            <div className="contact-email-actions">
              <a
                href={CONTACT_GMAIL_COMPOSE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {t('sayHello')}
              </a>
              <a href={CONTACT_MAILTO} className="contact-mailto-fallback">
                {t('contactUseMailApp')}
              </a>
            </div>
            <div className="contact-socials">
              <a
                href="https://www.linkedin.com/in/martin-orav-30747539b/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://github.com/martinorav-png" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a href="https://www.behance.net/martinorav" target="_blank" rel="noopener noreferrer" aria-label="Behance">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>{t('footer')}</p>
      </footer>
    </>
  );
}
