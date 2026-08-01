"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LightboxImage = {
  src: string;
  fallbackSrc?: string;
  alt?: string;
};

type HotelLightboxProps = {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
};

export function HotelLightbox({ images, initialIndex = 0, open, onClose }: HotelLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      resetZoom();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialIndex]);

  // Attach non-passive wheel listener to avoid passive event listener errors
  useEffect(() => {
    const wrapper = imageWrapperRef.current;
    if (!wrapper || !open) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale((s) => Math.min(s + 0.3, 5));
        setIsZoomed(true);
      } else {
        setScale((s) => {
          const newScale = Math.max(s - 0.3, 1);
          if (newScale <= 1) resetZoom();
          return newScale;
        });
      }
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [open]);

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length || isAnimating) return;
      setIsAnimating(true);
      resetZoom();
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 300);
    },
    [images.length, isAnimating, resetZoom],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, goNext, goPrev, onClose, resetZoom]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    setTouchStart(e.touches[0].clientX);
    setTouchDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || isZoomed) return;
    const delta = e.touches[0].clientX - touchStart;
    setTouchDelta(delta);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || isZoomed) return;
    const threshold = 80;
    if (touchDelta < -threshold) goNext();
    else if (touchDelta > threshold) goPrev();
    setTouchStart(null);
    setTouchDelta(0);
  };

  // Double-tap zoom
  const lastTap = useRef<number>(0);
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (isZoomed) {
        resetZoom();
      } else {
        setIsZoomed(true);
        setScale(2.5);
      }
    }
    lastTap.current = now;
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const slideOffset = touchDelta * 0.5;
  const imageSrc = brokenImages[currentImage.src] && currentImage.fallbackSrc
    ? currentImage.fallbackSrc
    : currentImage.src;

  return (
    <div
      ref={containerRef}
      className="hotel-lightbox-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imagenes"
    >
      <style>{`
        .hotel-lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightbox-fade-in 0.25s ease;
          touch-action: pan-y;
        }
        @keyframes lightbox-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hotel-lightbox-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10001;
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          backdrop-filter: blur(8px);
        }
        .hotel-lightbox-close:hover {
          background: rgba(255,255,255,0.3);
        }
        .hotel-lightbox-counter {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          font-family: 'Manrope', sans-serif;
          z-index: 10001;
          background: rgba(0,0,0,0.4);
          padding: 6px 16px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
        }
        .hotel-lightbox-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hotel-lightbox-image {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 4px;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          user-select: none;
          -webkit-user-drag: none;
        }
        .hotel-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10001;
          background: rgba(255,255,255,0.12);
          border: none;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .hotel-lightbox-nav:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-50%) scale(1.1);
        }
        .hotel-lightbox-nav:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .hotel-lightbox-prev { left: 16px; }
        .hotel-lightbox-next { right: 16px; }
        .hotel-lightbox-dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10001;
        }
        .hotel-lightbox-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s;
        }
        .hotel-lightbox-dot.active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }
        .hotel-lightbox-zoom-hint {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          font-family: 'Manrope', sans-serif;
          z-index: 10001;
        }
        @media (max-width: 768px) {
          .hotel-lightbox-nav {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
          .hotel-lightbox-prev { left: 8px; }
          .hotel-lightbox-next { right: 8px; }
        }
      `}</style>

      <button
        className="hotel-lightbox-close"
        onClick={onClose}
        aria-label="Cerrar visor"
      >
        ✕
      </button>

      <div className="hotel-lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>

      <div
        ref={imageWrapperRef}
        className="hotel-lightbox-image-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={currentImage.alt || ""}
          className="hotel-lightbox-image"
          style={{
            transform: `translateX(${slideOffset}px) scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transition: touchStart !== null ? "none" : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          draggable={false}
          onError={() => {
            // Try fallback if primary fails
            if (!brokenImages[currentImage.src]) {
              setBrokenImages((prev) => ({ ...prev, [currentImage.src]: true }));
            }
          }}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            className="hotel-lightbox-nav hotel-lightbox-prev"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button
            className="hotel-lightbox-nav hotel-lightbox-next"
            onClick={goNext}
            disabled={currentIndex === images.length - 1}
            aria-label="Imagen siguiente"
          >
            ›
          </button>

          <div className="hotel-lightbox-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`hotel-lightbox-dot ${i === currentIndex ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {isZoomed && (
        <div className="hotel-lightbox-zoom-hint">
          Doble toque o scroll para zoom · Tecla 0 para reset
        </div>
      )}
    </div>
  );
}
