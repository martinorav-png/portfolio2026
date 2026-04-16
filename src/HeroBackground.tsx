import { useEffect, useState } from 'react';
import type { Theme } from './ThemeLanguageContext';
import Iridescence from './components/Iridescence';

// Convert HSL (h: 0–360, s/l: 0–1) to a normalised RGB triplet.
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

// Light mode: full hue wheel, high saturation, bright — always visually distinct.
function randomLightColor(): [number, number, number] {
  const hue = Math.random() * 360;         // any hue
  const sat = 0.7 + Math.random() * 0.3;  // 70–100% saturated
  const lit = 0.62 + Math.random() * 0.16; // 62–78% lightness
  return hslToRgb(hue, sat, lit);
}

// Dark mode: full hue wheel, moderate saturation, deep — moody but colourful.
function randomDarkColor(): [number, number, number] {
  const hue = Math.random() * 360;
  const sat = 0.4 + Math.random() * 0.35; // 40–75% saturated
  const lit = 0.12 + Math.random() * 0.14; // 12–26% lightness
  return hslToRgb(hue, sat, lit);
}

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
  const [showGL, setShowGL] = useState(false);
  // Both frozen on mount — different palette every page load.
  const [lightColor] = useState<[number, number, number]>(randomLightColor);
  const [darkColor] = useState<[number, number, number]>(randomDarkColor);

  useEffect(() => {
    if (coarsePointer) return;
    const id = window.setTimeout(() => setShowGL(true), 200);
    return () => window.clearTimeout(id);
  }, [coarsePointer]);

  if (coarsePointer || !showGL) return null;

  if (theme === 'dark') {
    return (
      <div className="hero-dither-layer" aria-hidden>
          <Iridescence
            color={darkColor}
            speed={0.8}
            amplitude={0.08}
            mouseReact={false}
          />
      </div>
    );
  }

  return (
    <div className="hero-ballpit-layer" aria-hidden>
      <Iridescence
        color={lightColor}
        speed={1.0}
        amplitude={0.1}
        mouseReact={false}
      />
    </div>
  );
}
