import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type TLEntry = {
  id: string;
  /** Short year string shown on the spine node, e.g. "2026" */
  year: string;
  title: string;
  meta: string;
  desc: string;
  imgSrc?: string;
  imgAlt?: string;
  /** If set, renders a <video> instead of <img> */
  videoSrc?: string;
  /** If set, shows the live badge and wires data-live-url on the card */
  liveUrl?: string;
  /** Completely custom card render (e.g. CatweesMotionCollectionCard) */
  renderCard?: () => ReactNode;
};

function DefaultCard({ item }: { item: TLEntry }) {
  return (
    <div
      className="work-card"
      data-desc={item.desc}
      {...(item.liveUrl ? { 'data-live-url': item.liveUrl } : {})}
    >
      <div className={`work-card-img${item.videoSrc ? ' work-card-img--video' : ''}`}>
        {item.liveUrl && (
          <span className="work-live-badge" aria-label="Live deployment">
            <span className="work-live-badge__dot" aria-hidden />live
          </span>
        )}
        {item.videoSrc ? (
          <video
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
            aria-label={item.imgAlt}
          >
            <source src={item.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={item.imgSrc} alt={item.imgAlt ?? ''} loading="lazy" />
        )}
      </div>
      <div className="work-card-info">
        <h3>{item.title}</h3>
        <span className="work-meta">{item.meta}</span>
      </div>
    </div>
  );
}

export default function WorkTimeline({ items }: { items: TLEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('tl-row--in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    ref.current?.querySelectorAll('.tl-row').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <div className="work-timeline" ref={ref}>
      {items.map((item, i) => {
        const isRight = i % 2 === 0;
        const card = item.renderCard ? item.renderCard() : <DefaultCard item={item} />;
        return (
          <div
            key={item.id}
            className={`tl-row ${isRight ? 'tl-row--r' : 'tl-row--l'}`}
            style={{ '--tl-i': i } as CSSProperties}
          >
            {/* Left half: card slot for left-side items */}
            <div className="tl-half tl-half--l">
              {!isRight && card}
            </div>

            {/* Center spine: dot + year label */}
            <div className="tl-spine-col">
              <div className="tl-node">
                <span className="tl-dot" aria-hidden />
                <span className="tl-year">{item.year}</span>
              </div>
            </div>

            {/* Right half: card slot for right-side items */}
            <div className="tl-half tl-half--r">
              {isRight && card}
            </div>
          </div>
        );
      })}
    </div>
  );
}
