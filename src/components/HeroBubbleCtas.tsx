import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import './HeroBubbleCtas.css';

export type HeroBubbleCtaItem = {
  href: string;
  label: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor: string; textColor: string };
};

type Props = {
  items: HeroBubbleCtaItem[];
};

export default function HeroBubbleCtas({ items }: Props) {
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelsRef.current.filter(Boolean);
    if (!bubbles.length) return;

    gsap.killTweensOf([...bubbles, ...labels]);
    gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(labels, { y: 18, autoAlpha: 0 });

    bubbles.forEach((bubble, i) => {
      const delay = 0.38 + i * 0.12;
      const tl = gsap.timeline({ delay });
      tl.to(bubble, {
        scale: 1,
        duration: 0.52,
        ease: 'back.out(1.45)',
      });
      const label = labels[i];
      if (label) {
        tl.to(
          label,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.42,
            ease: 'power3.out',
          },
          '-=0.42'
        );
      }
    });
  }, [items]);

  return (
    <div className="hero-bubble-ctas">
      {items.map((item, idx) => (
        <a
          key={`${item.href}-${idx}`}
          href={item.href}
          className="hero-bubble-cta"
          aria-label={item.ariaLabel ?? item.label}
          style={
            {
              '--hb-rot': `${item.rotation ?? 0}deg`,
              ...(item.hoverStyles
                ? {
                    '--hb-hover-bg': item.hoverStyles.bgColor,
                    '--hb-hover-fg': item.hoverStyles.textColor,
                  }
                : {}),
            } as CSSProperties
          }
          ref={(el) => {
            bubblesRef.current[idx] = el;
          }}
        >
          <span
            className="hero-bubble-cta__label"
            ref={(el) => {
              labelsRef.current[idx] = el;
            }}
          >
            {item.label}
          </span>
        </a>
      ))}
    </div>
  );
}
