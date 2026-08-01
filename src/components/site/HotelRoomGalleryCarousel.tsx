"use client";

import Image from "next/image";
import { useState } from "react";
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
  const slideCount = slides.length;

  const counterLabel = locale === "en" ? "photos" : "fotos";

  return (
    <div className="hotel-room-carousel">
      <div className="hotel-room-carousel-head">
        <p>
          <strong>{slideCount}</strong> {counterLabel}
        </p>
      </div>

      {/* Instagram-style horizontal scrollable strip */}
      <div className="hotel-room-carousel-strip">
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

      <HotelLightbox
        images={slides.map((s) => ({ src: s.webpSrc, fallbackSrc: s.jpgSrc, alt: s.alt }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
