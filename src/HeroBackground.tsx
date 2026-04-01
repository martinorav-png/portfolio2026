import { lazy, Suspense } from 'react';
import Ballpit from './components/Ballpit';
import type { Theme } from './ThemeLanguageContext';

const Dither = lazy(() => import('./components/Dither'));

export default function HeroBackground({ theme }: { theme: Theme }) {
  if (theme === 'dark') {
    return (
      <div className="hero-dither-layer" aria-hidden>
        <Suspense fallback={null}>
          <Dither
            waveColor={[0.5, 0.5, 0.5]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="hero-ballpit-layer" aria-hidden>
      <Ballpit
        className="ballpit"
        count={100}
        gravity={0.01}
        friction={0.9975}
        wallBounce={0.95}
        followCursor
      />
    </div>
  );
}
