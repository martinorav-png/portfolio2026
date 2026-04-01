import { useEffect, useState } from 'react';
import ASCIIText from './components/ASCIIText';
import BounceCards from './components/BounceCards';
import { initSiteEffects } from './site-effects';

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
  '/assets/works/mpr-patch.jpg',
  '/assets/works/swimming-poster.jpg',
  '/assets/works/honey-boot.png',
] as const;

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
  const [heroFeatureImages] = useState(() => pickRandomUnique(HERO_IMAGE_POOL, 4));

  useEffect(() => {
    try {
      return initSiteEffects();
    } catch (e) {
      console.error('initSiteEffects failed:', e);
      return undefined;
    }
  }, []);

  return (
    <>
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            Martin.
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="hero-dots" />
        <div className="hero-grain" />

        <div className="hero-content">
          <p className="hero-label anim-fade-up">
            <span className="prism-text">Hey, I&apos;m</span>
          </p>
          <div className="ascii-name-container anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <ASCIIText
              text="Martin"
              enableWaves
              asciiFontSize={10}
              textFontSize={300}
              planeBaseHeight={13}
              textColor="#fdf9f3"
            />
          </div>
          <p className="hero-subtitle anim-fade-up" style={{ animationDelay: '0.2s' }}>
            A student with a thing for design. I make graphics, UI concepts, and sometimes posters of albums I like.
          </p>
          <div className="hero-cta anim-fade-up" style={{ animationDelay: '0.35s' }}>
            <a href="#work" className="btn btn-primary">
              See What I&apos;ve Made
            </a>
            <a href="#contact" className="btn btn-secondary">
              Say Hi
            </a>
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
          />
        </div>
        <div className="hero-scroll-hint anim-fade-up" style={{ animationDelay: '0.7s' }}>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="gradient-divider" />

      <section className="section" id="work">
        <div className="container">
          <h2 className="section-title reveal">Selected Work</h2>
          <p className="section-subtitle reveal">A mix of client projects, UI concepts, and personal experiments.</p>

          <div className="work-grid">
            <div
              className="work-card reveal"
              data-desc="A fictional landing page for the upcoming Honda Prelude, built as a UI challenge. Focused on bold typography, a dark automotive aesthetic, and spec highlights."
            >
              <div className="work-card-img">
                <img src="/assets/works/honda-prelude-ui.jpg" alt="Honda Prelude Landing Page UI" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>Honda Prelude - Landing Page Concept</h3>
                <span className="work-meta">UI Design &middot; 2026</span>
              </div>
            </div>

            <div
              className="work-card reveal"
              data-desc="Landing page concept for a fictional psychological horror game. Designed the full page with countdown timer, gallery, and a story-driven layout."
            >
              <div className="work-card-img">
                <img src="/assets/works/substrate-game.jpg" alt="Substrate Game Landing Page" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>Substrate - Game Landing Page</h3>
                <span className="work-meta">UI Design &middot; Concept &middot; 2026</span>
              </div>
            </div>

            <div
              className="work-card reveal"
              data-desc="FTP honeypot and ESP32 flasher experience, built during the Cursor Hackathon (26 March 2026). Co-created with Gert Tali, Lukas Haavel, and Rivo Tüksammel. Deployed on Cloudflare Workers."
              data-live-url="https://honey-boot.rivo-tuksammel.workers.dev"
            >
              <div className="work-card-img">
                <img src="/assets/works/honey-boot.png" alt="HONEY//BOOT ESP32 flasher UI" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>HONEY//BOOT</h3>
                <span className="work-meta">Hackathon &middot; Security / IoT &middot; 2026</span>
              </div>
            </div>

            <div
              className="work-card reveal"
              data-desc="Full landing page design for Pulse, a concept SaaS app that tracks team mood through anonymous monthly surveys. Features AI-powered recommendations, dashboard UI, pricing, and a custom mascot."
              data-full-img="/assets/works/pulse-landing-full.jpg"
            >
              <div className="work-card-img">
                <img src="/assets/works/pulse-hero.jpg" alt="Pulse App Hero Section" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>Pulse - Team Wellness App</h3>
                <span className="work-meta">Product Design &middot; Full Landing Page &middot; 2025</span>
              </div>
            </div>

            <div
              className="work-card reveal"
              data-desc="Web banner for Catwees, a Honda and Opel dealership in Estonia. Showcased their full electric and hybrid SUV range with a bold dark blue and neon glow look."
            >
              <div className="work-card-img">
                <img src="/assets/works/honda-suv-lineup.jpg" alt="Honda SUV Lineup Banner for Catwees" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>Catwees Honda - SUV Lineup Banner</h3>
                <span className="work-meta">Graphic Design &middot; Client Work &middot; 2023</span>
              </div>
            </div>

            <div
              className="work-card reveal"
              data-desc="A timeline poster tracing every generation of the Honda Civic from 1972 to 2022. Made for the Catwees dealership to celebrate the Civic e:HEV launch."
            >
              <div className="work-card-img">
                <img src="/assets/works/civic-50th.jpg" alt="Honda Civic 50th Anniversary Timeline Poster" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>Honda Civic 50th Anniversary</h3>
                <span className="work-meta">Graphic Design &middot; Client Work &middot; 2022</span>
              </div>
            </div>

            <div
              className="work-card reveal"
              data-desc="Fan-made poster for The Weeknd's After Hours album. Designed with warm bokeh tones, tracklist layout, and Spotify code integration."
            >
              <div className="work-card-img">
                <img src="/assets/works/after-hours-poster.jpg" alt="The Weeknd After Hours Album Poster" loading="lazy" />
              </div>
              <div className="work-card-info">
                <h3>After Hours - Album Poster</h3>
                <span className="work-meta">Poster Design &middot; Personal &middot; 2024</span>
              </div>
            </div>
          </div>

          <div className="work-cta reveal">
            <a href="/work.html" className="btn btn-primary">
              View All Work
            </a>
          </div>
        </div>
      </section>

      <section className="section section-dark" id="skills">
        <div className="container">
          <h2 className="section-title reveal">Tools & Skills</h2>
          <div className="tools-strip reveal">
            <span className="tool-tag">Photoshop</span>
            <span className="tool-tag">Figma</span>
            <span className="tool-tag">Illustrator</span>
            <span className="tool-tag">After Effects</span>
            <span className="tool-tag">HTML / CSS</span>
            <span className="tool-tag">JavaScript</span>
            <span className="tool-tag">UI Design</span>
            <span className="tool-tag">Graphic Design</span>
            <span className="tool-tag">Branding</span>
            <span className="tool-tag">Motion Graphics</span>
            <span className="tool-tag">Print Design</span>
            <span className="tool-tag">Email Design</span>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-container">
          <h2 className="section-title reveal">Say Hi</h2>
          <p className="section-subtitle reveal">Want to chat or work on something together? I&apos;m always open to it.</p>
          <div className="contact-links reveal">
            <a href="mailto:martinoravdisain@gmail.com" className="btn btn-primary">
              Say Hello
            </a>
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
        <p>&copy; 2026 Martin Orav. Built with care.</p>
      </footer>
    </>
  );
}
