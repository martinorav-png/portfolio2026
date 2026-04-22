import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CATWEES_MOTION_COLLECTION_IDS,
  MOTION_COLLECTION_PREVIEW_IDS,
  MOTION_ITEM_MEDIA,
  type CatweesMotionCollectionItemId,
} from '../catweesMotionCollection';
import type { Locale } from '../messages';
import { workHomeCard } from '../workHomeLocale';

type Props = {
  locale: Locale;
  /** Pass true when the card is inside a WorkTimeline row (parent handles entrance animation) */
  noReveal?: boolean;
};

function MotionThumb({
  id,
  className,
  mutedAutoPlay,
  locale,
}: {
  id: CatweesMotionCollectionItemId;
  className?: string;
  mutedAutoPlay?: boolean;
  locale: Locale;
}) {
  const media = MOTION_ITEM_MEDIA[id];
  const alt = workHomeCard(locale, id).imgAlt;

  if (media.kind === 'video') {
    return (
      <video
        className={className}
        muted
        playsInline
        loop
        autoPlay={!!mutedAutoPlay}
        preload="metadata"
        aria-label={alt}
      >
        <source src={media.src} type="video/mp4" />
      </video>
    );
  }
  return <img className={className} src={media.src} alt={alt} loading="lazy" />;
}

export default function CatweesMotionCollectionCard({ locale, noReveal = false }: Props) {
  const coll = workHomeCard(locale, 'catweesMotionCollection');
  const [open, setOpen] = useState(false);
  const [detailId, setDetailId] = useState<CatweesMotionCollectionItemId | null>(null);

  const backLabel = locale === 'et' ? 'Tagasi võrgustikku' : 'Back to grid';
  const closeLabel = locale === 'et' ? 'Sulge' : 'Close';

  const closeAll = useCallback(() => {
    setDetailId(null);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (detailId) setDetailId(null);
        else closeAll();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, detailId, closeAll]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const overlay =
    open &&
    createPortal(
      <div
        className="motion-collection-overlay active"
        role="dialog"
        aria-modal="true"
        aria-labelledby="motion-collection-heading"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAll();
        }}
      >
        <div className="motion-collection-panel">
          <button type="button" className="motion-collection-close" aria-label={closeLabel} onClick={closeAll}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {!detailId ? (
            <>
              <header className="motion-collection-header">
                <h2 id="motion-collection-heading">{coll.title}</h2>
                <p className="motion-collection-lead">{coll.desc}</p>
                <span className="motion-collection-meta">{coll.meta}</span>
              </header>
              <div className="motion-collection-grid">
                {CATWEES_MOTION_COLLECTION_IDS.map((id) => {
                  const item = workHomeCard(locale, id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className="motion-collection-tile"
                      onClick={() => setDetailId(id)}
                    >
                      <div className="motion-collection-tile-media">
                        <MotionThumb id={id} mutedAutoPlay locale={locale} />
                      </div>
                      <span className="motion-collection-tile-title">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="motion-collection-detail">
              <button type="button" className="motion-collection-back btn btn-secondary" onClick={() => setDetailId(null)}>
                {backLabel}
              </button>
              {(() => {
                const item = workHomeCard(locale, detailId);
                const media = MOTION_ITEM_MEDIA[detailId];
                return (
                  <>
                    <div className="motion-collection-detail-media">
                      {media.kind === 'video' ? (
                        <video controls playsInline loop preload="metadata" className="motion-collection-detail-vid">
                          <source src={media.src} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={media.src} alt={item.imgAlt} className="motion-collection-detail-img" />
                      )}
                    </div>
                    <div className="motion-collection-detail-info">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                      <span className="work-meta">{item.meta}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div
        className={`work-card work-card--motion-collection${noReveal ? '' : ' reveal'}`}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="work-card-img work-card-img--motion-collection">
          {coll.pieceCountBadge ? (
            <span className="work-piece-count-badge">{coll.pieceCountBadge}</span>
          ) : null}
          <div className="motion-collection-preview-grid" aria-hidden="true">
            {MOTION_COLLECTION_PREVIEW_IDS.map((id) => (
              <div key={id} className="motion-collection-preview-cell">
                <MotionThumb id={id} className="motion-collection-preview-cell-media" mutedAutoPlay locale={locale} />
              </div>
            ))}
          </div>
        </div>
        <div className="work-card-info">
          <h3>{coll.title}</h3>
          <p>{coll.desc}</p>
          <span className="work-meta">{coll.meta}</span>
        </div>
      </div>
      {overlay}
    </>
  );
}
