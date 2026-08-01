"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HotelLocale } from "@/lib/hotel-experience";
import type { HotelRoomGallerySlide } from "@/lib/hotel-room-gallery";
import { HotelLightbox } from "./HotelLightbox";

type HotelRoomGalleryCarouselProps = {
  locale: HotelLocale;
  roomTitle: string;
  slides: HotelRoomGallerySlide[];
};

export function HotelRoomGalleryCarousel({ locale, roomTitle, slides }: HotelRoomGalleryCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [fallbackSlides, setFallbackSlides] = useState<Record<string, boolean>>({});
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = slides.length;

  const counterLabel = locale === "en" ? "photos" : "fotos";

  // Check scroll position for arrow visibility & active dot
  const checkScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 2;
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(overflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 2);

    // Calculate active slide index based on scroll position
    const thumbWidth = el.querySelector(".hotel-room-carousel-thumb")?.clientWidth || 200;
    const index = Math.round(el.scrollLeft / (thumbWidth + 8));
    setActiveSlide(Math.min(index, slideCount - 1));
  }, [slideCount]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    // MutationObserver to detect when next/image loads and adds sized elements
    const mutationObserver = new MutationObserver(() => {
      checkScroll();
    });
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true });

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      mutationObserver.disconnect();
    };
  }, [checkScroll]);

  // Re-check after delays to catch lazy-loaded images
  useEffect(() => {
    const timers = [50, 200, 500, 1000, 2000, 4000].map((ms) =>
      setTimeout(checkScroll, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [checkScroll]);

  const scrollByThumb = useCallback((direction: "left" | "right") => {
    const el = stripRef.current;
    if (!el) return;
    const thumbWidth = el.querySelector(".hotel-room-carousel-thumb")?.clientWidth || 200;
    const scrollAmount = thumbWidth + 8;
    el.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const el = stripRef.current;
    if (!el) return;
    const thumbWidth = el.querySelector(".hotel-room-carousel-thumb")?.clientWidth || 200;
    el.scrollTo({ left: index * (thumbWidth + 8), behavior: "smooth" });
  }, []);

  // Fallback: always show right arrow if there are more than 3 slides
  // (they won't all fit in the strip at once)
  const showRightArrow = hasOverflow ? canScrollRight : slideCount > 1;
  const showLeftArrow = hasOverflow ? canScrollLeft : false;

  return (
    <div className="hotel-room-carousel">
      <div className="hotel-room-carousel-head">
        <p>
          <strong>{slideCount}</strong> {counterLabel}
        </p>
      </div>

      {/* Scrollable strip with arrows */}
      <div className="hotel-room-carousel-strip-wrapper">
        {(hasOverflow && canScrollLeft) && (
          <button
            className="hotel-room-carousel-arrow hotel-room-carousel-arrow-left"
            onClick={() => scrollByThumb("left")}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        <div className="hotel-room-carousel-strip" ref={stripRef}>
          {slides.map((slide, index) => (
            <div
              className="hotel-room-carousel-thumb"
              key={slide.id}
              onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") { setLightboxIndex(index); setLightboxOpen(true); } }}
              aria-label={`${roomTitle} - ${index + 1}`}
            >
              <Image
                alt={slide.alt}
                className="hotel-room-carousel-thumb-image"
                draggable={false}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 860px) 100vw, 80vw"
                src={fallbackSlides[slide.id] ? slide.jpgSrc : slide.webpSrc}
                onError={() =>
                  setFallbackSlides((current) =>
                    current[slide.id] ? current : { ...current, [slide.id]: true }
                  )
                }
                onLoad={() => checkScroll()}
              />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            className="hotel-room-carousel-arrow hotel-room-carousel-arrow-right"
            onClick={() => scrollByThumb("right")}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
      </div>

      {/* Dot indicators for hero mode */}
      {slideCount > 1 && (
        <div className="hotel-room-carousel-dots" aria-label="Slide indicators">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`hotel-room-carousel-dot${index === activeSlide ? " is-active" : ""}`}
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <HotelLightbox
        images={slides.map((s) => ({ src: s.webpSrc, fallbackSrc: s.jpgSrc, alt: s.alt }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
