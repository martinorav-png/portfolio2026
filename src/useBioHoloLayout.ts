import { useEffect, useState } from 'react';

/**
 * Full ProfileCard holo is heavy and breaks portrait compositing on mobile WebKit.
 * Enable holo only on fine pointer + reasonably wide viewport (desktop / laptop).
 */
export function useBioHoloLayout(): boolean {
  const [showHolo, setShowHolo] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine) and (min-width: 769px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 769px)');
    const sync = () => setShowHolo(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return showHolo;
}
