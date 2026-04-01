import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export type BounceCardsProps = {
  className?: string;
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
};

const defaultTransforms = [
  'rotate(5deg) translate(-120px, 4px)',
  'rotate(0deg) translate(-45px, -2px)',
  'rotate(-5deg) translate(45px, 6px)',
  'rotate(5deg) translate(120px, 0px)',
];

export default function BounceCards({
  className = '',
  images,
  containerWidth = 500,
  containerHeight = 250,
  animationDelay = 1,
  animationStagger = 0.08,
  easeType = 'elastic.out(1, 0.5)',
  transformStyles,
  enableHover = true,
}: BounceCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const styles =
    transformStyles && transformStyles.length >= images.length
      ? transformStyles
      : defaultTransforms.slice(0, Math.max(images.length, 1));

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || images.length === 0) return;

    const outers = [...root.querySelectorAll<HTMLDivElement>('[data-bounce-card]')];

    const hoverCleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      gsap.set(outers, { scale: 0, opacity: 0, y: 72 });

      gsap.to(outers, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.35,
        ease: easeType,
        stagger: animationStagger,
        delay: animationDelay,
        overwrite: 'auto',
      });

      if (!enableHover) return;

      outers.forEach((el) => {
        const onEnter = () => {
          gsap.to(el, { y: -10, scale: 1.06, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        };
        const onLeave = () => {
          gsap.to(el, { y: 0, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
        };
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        hoverCleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }, root);

    return () => {
      hoverCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [images, animationDelay, animationStagger, easeType, enableHover]);

  return (
    <div
      ref={rootRef}
      className={`bounce-cards ${className}`.trim()}
      style={{
        width: '100%',
        maxWidth: containerWidth,
        height: containerHeight,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          data-bounce-card
          className="bounce-cards__outer"
          style={{
            position: 'absolute',
            left: '50%',
            top: '55%',
            width: 'clamp(72px, 26vw, 140px)',
            height: 'clamp(49px, 18vw, 95px)',
            marginLeft: 'calc(-0.5 * clamp(72px, 26vw, 140px))',
            marginTop: 'calc(-0.5 * clamp(49px, 18vw, 95px))',
            transformOrigin: 'center center',
            zIndex: i + 1,
            cursor: enableHover ? 'pointer' : undefined,
          }}
        >
          <div
            className="bounce-cards__inner"
            style={{
              width: '100%',
              height: '100%',
              transform: styles[i] ?? styles[styles.length - 1],
              transformOrigin: 'center center',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 10px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid var(--color-border, #e5e5e5)',
            }}
          >
            <img
              src={src}
              alt=""
              draggable={false}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
