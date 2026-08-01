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
  const slideCount = slides.length;

  const counterLabel = locale === "en" ? "photos" : "fotos";

  // Check scroll position for arrow visibility
  const checkScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollByThumb = useCallback((direction: "left" | "right") => {
    const el = stripRef.current;
    if (!el) return;
    const thumbWidth = el.querySelector(".hotel-room-carousel-thumb")?.clientWidth || 200;
    const scrollAmount = thumbWidth + 8; // 8 = gap
    el.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  }, []);

  return (
    <div className="hotel-room-carousel">
      <div className="hotel-room-carousel-head">
        <p>
          <strong>{slideCount}</strong> {counterLabel}
        </p>
      </div>

      {/* Scrollable strip with arrows */}
      <div className="hotel-room-carousel-strip-wrapper">
        {canScrollLeft && (
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
                sizes="(max-width: 640px) 45vw, (max-width: 860px) 30vw, 22vw"
                src={fallbackSlides[slide.id] ? slide.jpgSrc : slide.webpSrc}
                onError={() =>
                  setFallbackSlides((current) =>
                    current[slide.id] ? current : { ...current, [slide.id]: true }
                  )
                }
              />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            className="hotel-room-carousel-arrow hotel-room-carousel-arrow-right"
            onClick={() => scrollByThumb("right")}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
      </div>

      <HotelLightbox
        images={slides.map((s) => ({ src: s.webpSrc, fallbackSrc: s.jpgSrc, alt: s.alt }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
