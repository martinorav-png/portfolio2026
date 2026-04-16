import { lazy, Suspense, useEffect, useState } from 'react';
import type { Theme } from './ThemeLanguageContext';

const Ballpit = lazy(() => import('./components/Ballpit'));

const Dither = lazy(() => import('./components/Dither'));

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return coarse;
}

export default function HeroBackground({ theme }: { theme: Theme }) {
  const coarsePointer = useCoarsePointer();
  // Delay GL startup until the main thread is free — keeps TBT low on desktop.
  // On touch/mobile devices skip WebGL entirely; the CSS orbs already provide
  // visual interest and the physics + shader compilation are too expensive.
  const [showGL, setShowGL] = useState(false);

  useEffect(() => {
    if (coarsePointer) return;
    const id = window.setTimeout(() => setShowGL(true), 2000);
    return () => window.clearTimeout(id);
  }, [coarsePointer]);

  if (coarsePointer || !showGL) return null;

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
      <Suspense fallback={null}>
        <Ballpit
          className="ballpit"
          count={100}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor
        />
      </Suspense>
    </div>
  );
}
