import { lazy, Suspense, useEffect, useState } from 'react';
import Ballpit from './components/Ballpit';
import type { Theme } from './ThemeLanguageContext';

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
  const ballpitInteractive = !coarsePointer;
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
        key={ballpitInteractive ? 'ballpit-interactive' : 'ballpit-static'}
        className="ballpit"
        count={100}
        gravity={0.01}
        friction={0.9975}
        wallBounce={0.95}
        followCursor={ballpitInteractive}
      />
    </div>
  );
}
