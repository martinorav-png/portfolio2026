import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';
import type { CaseStudy } from '../workHomeLocale';

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
  /** Long-form case study content shown in a modal */
  caseStudy?: CaseStudy;
  /** Completely custom card render (e.g. CatweesMotionCollectionCard) */
  renderCard?: () => ReactNode;
};

function DefaultCard({
  item,
  onOpenCaseStudy,
}: {
  item: TLEntry;
  onOpenCaseStudy?: () => void;
}) {
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
        {onOpenCaseStudy && (
          <button
            type="button"
            className="case-study-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCaseStudy();
            }}
          >
            Case study <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}

function CaseStudyModal({
  item,
  onClose,
}: {
  item: TLEntry;
  onClose: () => void;
}) {
  const cs = item.caseStudy!;

  return createPortal(
    <div
      className="case-study-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="case-study-panel">
        <button
          type="button"
          className="case-study-close"
          aria-label="Close case study"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <header className="case-study-header">
          <p className="case-study-meta">{item.meta}</p>
          <h2 id="cs-modal-title" className="case-study-title">{item.title}</h2>
        </header>

        <div className="case-study-body">
          {cs.intro && <p className="case-study-intro">{cs.intro}</p>}
          {cs.sections.map((s) => (
            <div key={s.heading} className="case-study-section">
              <h3 className="case-study-section-heading">{s.heading}</h3>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} className="case-study-section-body">{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function WorkTimeline({ items }: { items: TLEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [caseStudyItem, setCaseStudyItem] = useState<TLEntry | null>(null);

  const closeModal = useCallback(() => setCaseStudyItem(null), []);

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

  useEffect(() => {
    if (!caseStudyItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [caseStudyItem, closeModal]);

  useEffect(() => {
    if (caseStudyItem) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [caseStudyItem]);

  return (
    <>
      <div className="work-timeline" ref={ref}>
        {items.map((item, i) => {
          const isRight = i % 2 === 0;
          const card = item.renderCard
            ? item.renderCard()
            : (
              <DefaultCard
                item={item}
                onOpenCaseStudy={item.caseStudy ? () => setCaseStudyItem(item) : undefined}
              />
            );
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

      {caseStudyItem && <CaseStudyModal item={caseStudyItem} onClose={closeModal} />}
    </>
  );
}
