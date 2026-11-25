'use client';

import { useEffect, useState } from 'react';

export type GalleryPhoto = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  context?: { custom?: { caption?: string; alt?: string; category?: string } };
};

const PAGE_SIZE = 12;
export default function GalleryPhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [active]);

  return <>
    <div className="gallery-photo-grid">
      {photos.slice(0, visibleCount).map((photo, index) => {
        const title = photo.context?.custom?.caption || 'M² INTERIORS';
        return <button
          className="gallery-photo-card"
          type="button"
          key={photo.asset_id || photo.public_id}
          onClick={() => setActive(photo)}
          aria-label={`View ${title}`}
        >
          <span className="gallery-photo">
            <img src={photo.secure_url} alt={title} loading="lazy" />
            <span className="gallery-photo-open">VIEW PROJECT ↗</span>
          </span>
          <span className="gallery-photo-caption">
            <span>{title}</span>
            <span>{String(index + 1).padStart(2, '0')}</span>
          </span>
        </button>;
      })}
    </div>

    {visibleCount < photos.length && (
      <div className="gallery-load-more-wrap">
        <button className="gallery-load-more" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
          LOAD MORE PHOTOGRAPHS <span>↗</span>
        </button>
        <p>Showing {Math.min(visibleCount, photos.length)} of {photos.length} photographs</p>
      </div>
    )}

    {active && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Project photograph" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setActive(null);
    }}>
      <button className="gallery-lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Close image">×</button>
      <div className="gallery-lightbox-content">
        <div className="gallery-lightbox-image">
          <img src={active.secure_url} alt={active.context?.custom?.caption || 'M² Interiors project'} />
        </div>
        <div className="gallery-lightbox-info">
          <p className="world-kicker">M² INTERIORS / PROJECT DETAIL</p>
          <h3>{active.context?.custom?.caption || 'A considered space.'}</h3>
          {active.context?.custom?.category && <span className="gallery-lightbox-category">{active.context.custom.category}</span>}
          {active.context?.custom?.alt && <p>{active.context.custom.alt}</p>}
        </div>
      </div>
    </div>}
  </>;
}
