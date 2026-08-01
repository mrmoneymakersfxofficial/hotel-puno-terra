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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Sync index when initialIndex changes (e.g. opening lightbox on a specific image)
  const prevOpen = useRef(false);
  useEffect(() => {
    if (open && !prevOpen.current) {
      setCurrentIndex(initialIndex);
      resetZoom();
      document.body.style.overflow = "hidden";
      // Scroll to the initial image after mount
      requestAnimationFrame(() => {
        if (scrollerRef.current) {
          const child = scrollerRef.current.children[initialIndex] as HTMLElement;
          if (child) {
            scrollerRef.current.scrollTo({ left: child.offsetLeft, behavior: "instant" as ScrollBehavior });
          }
        }
      });
      // Mark all images as needing load
      setLoadedImages(new Set());
      setFailedImages(new Set());
    }
    if (!open) {
      document.body.style.overflow = "";
    }
    prevOpen.current = open;
    return () => {
      if (!open) document.body.style.overflow = "";
    };
  }, [open, initialIndex]);

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    setScale(1);
    setPanX(0);
    setPanY(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "0") { resetZoom(); return; }
      if (isZoomed) return;
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, currentIndex, isZoomed, onClose, resetZoom]);

  // Non-passive wheel listener for zoom
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !open) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale((s) => Math.min(s + 0.3, 5));
        setIsZoomed(true);
      } else {
        setScale((s) => {
          const ns = Math.max(s - 0.3, 1);
          if (ns <= 1) resetZoom();
          return ns;
        });
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [open, resetZoom]);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return;
    resetZoom();
    setCurrentIndex(index);
    if (scrollerRef.current) {
      const child = scrollerRef.current.children[index] as HTMLElement;
      if (child) {
        scrollerRef.current.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
      }
    }
  }, [images.length, resetZoom]);

  // Scroll observer to sync currentIndex
  const handleScroll = useCallback(() => {
    if (!scrollerRef.current || isZoomed) return;
    const scroller = scrollerRef.current;
    const scrollLeft = scroller.scrollLeft;
    const width = scroller.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, images.length, isZoomed]);

  // Touch handlers for swipe (when not zoomed)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    setTouchStart(e.touches[0].clientX);
    setTouchDelta(0);
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || isZoomed || !isDragging.current) return;
    const delta = e.touches[0].clientX - touchStart;
    setTouchDelta(delta);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || isZoomed || !isDragging.current) return;
    isDragging.current = false;
    const threshold = 80;
    if (touchDelta < -threshold) goTo(currentIndex + 1);
    else if (touchDelta > threshold) goTo(currentIndex - 1);
    setTouchStart(null);
    setTouchDelta(0);
  };

  // Double-tap zoom
  const lastTap = useRef<number>(0);
  const handleDoubleTap = () => {
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

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  if (!open || images.length === 0) return null;

  return (
    <div
      ref={overlayRef}
      className="hlbx-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imagenes"
    >
      <style>{`
        .hlbx-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.96);
          display: flex;
          flex-direction: column;
          animation: hlbx-in 0.2s ease;
          overscroll-behavior: contain;
        }
        @keyframes hlbx-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hlbx-topbar {
          position: relative;
          z-index: 10002;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          flex-shrink: 0;
        }
        .hlbx-counter {
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          font-weight: 600;
          font-family: 'Manrope', sans-serif;
          background: rgba(255,255,255,0.1);
          padding: 5px 14px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
        }
        .hlbx-close {
          background: rgba(255,255,255,0.12);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          backdrop-filter: blur(8px);
        }
        .hlbx-close:hover { background: rgba(255,255,255,0.25); }
        .hlbx-scroller {
          flex: 1;
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .hlbx-scroller::-webkit-scrollbar { display: none; }
        .hlbx-slide {
          flex: 0 0 100%;
          width: 100%;
          scroll-snap-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 0;
        }
        .hlbx-img {
          max-width: 92vw;
          max-height: 80vh;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          border-radius: 6px;
          opacity: 1;
          transition: opacity 0.15s ease;
        }
        .hlbx-img.loading {
          opacity: 0.3;
        }
        .hlbx-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10002;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          backdrop-filter: blur(8px);
        }
        .hlbx-nav:hover { background: rgba(255,255,255,0.22); }
        .hlbx-nav:disabled { opacity: 0.2; cursor: default; }
        .hlbx-prev { left: 12px; }
        .hlbx-next { right: 12px; }
        .hlbx-bottombar {
          position: relative;
          z-index: 10002;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 16px 20px;
          flex-shrink: 0;
        }
        .hlbx-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
        }
        .hlbx-dot.active {
          background: white;
          width: 20px;
          border-radius: 4px;
        }
        @media (max-width: 768px) {
          .hlbx-nav { width: 36px; height: 36px; font-size: 16px; }
          .hlbx-prev { left: 6px; }
          .hlbx-next { right: 6px; }
        }
      `}</style>

      {/* Top bar */}
      <div className="hlbx-topbar">
        <span className="hlbx-counter">{currentIndex + 1} / {images.length}</span>
        <button className="hlbx-close" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>

      {/* Instagram-style horizontal scroller */}
      <div
        ref={scrollerRef}
        className="hlbx-scroller"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        {images.map((img, i) => {
          const useFallback = failedImages.has(i) && img.fallbackSrc;
          const src = useFallback ? img.fallbackSrc! : img.src;
          const isLoaded = loadedImages.has(i);
          return (
            <div className="hlbx-slide" key={`${i}-${img.src}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={img.alt || ""}
                className={`hlbx-img${isLoaded ? "" : " loading"}`}
                style={{
                  transform: i === currentIndex && isZoomed
                    ? `scale(${scale}) translate(${panX}px, ${panY}px)`
                    : undefined,
                  transition: isZoomed ? "transform 0.15s ease" : undefined,
                }}
                draggable={false}
                onLoad={() => handleImageLoad(i)}
                onError={() => handleImageError(i)}
              />
            </div>
          );
        })}
      </div>

      {/* Nav buttons */}
      {images.length > 1 && (
        <>
          <button className="hlbx-nav hlbx-prev" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} aria-label="Anterior">‹</button>
          <button className="hlbx-nav hlbx-next" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === images.length - 1} aria-label="Siguiente">›</button>
        </>
      )}

      {/* Bottom dots */}
      {images.length > 1 && (
        <div className="hlbx-bottombar">
          {images.map((_, i) => (
            <button
              key={i}
              className={`hlbx-dot${i === currentIndex ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
