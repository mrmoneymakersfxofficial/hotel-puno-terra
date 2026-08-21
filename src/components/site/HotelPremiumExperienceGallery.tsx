"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { renderBalancedSectionTitle } from "./headline-balance";
import { getHotelUi, type HotelLocale } from "@/lib/hotel-experience";
import type { HotelExperienceGalleryItem } from "@/lib/hotel-experience-gallery";

type HotelPremiumExperienceGalleryProps = {
  items: HotelExperienceGalleryItem[];
  locale: HotelLocale;
};

type ExperienceGroup = {
  areaKey: HotelExperienceGalleryItem["areaKey"];
  areaLabel: string;
  items: HotelExperienceGalleryItem[];
};

const DRAG_THRESHOLD_MIN = 40;
const DRAG_THRESHOLD_MAX = 110;

export function HotelPremiumExperienceGallery({ items, locale }: HotelPremiumExperienceGalleryProps) {
  const ui = getHotelUi(locale);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragDeltaXRef = useRef(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const labels = useMemo(
    () => ({
      next: locale === "en" ? "Next photo" : "Foto siguiente",
      photos: locale === "en" ? "photos" : "fotos",
      previous: locale === "en" ? "Previous photo" : "Foto anterior",
    }),
    [locale],
  );

  const groups = useMemo<ExperienceGroup[]>(() => {
    const map = new Map<HotelExperienceGalleryItem["areaKey"], ExperienceGroup>();

    for (const item of items) {
      const existing = map.get(item.areaKey);
      if (existing) {
        existing.items.push(item);
        continue;
      }

      map.set(item.areaKey, {
        areaKey: item.areaKey,
        areaLabel: item.areaLabel,
        items: [item],
      });
    }

    return Array.from(map.values());
  }, [items]);

  const currentGroup = groups[activeGroupIndex] ?? groups[0];
  const currentItems = currentGroup?.items ?? [];
  const slideCount = currentItems.length;
  const hasControls = groups.length > 1 || slideCount > 1;

  useEffect(() => {
    const activeTab = tabRefs.current[activeGroupIndex];
    activeTab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeGroupIndex]);

  useEffect(() => {
    const updateStep = () => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const slides = track.querySelectorAll<HTMLElement>("[data-experience-slide]");
      if (!slides.length) {
        return;
      }

      if (slides.length > 1) {
        setStep(slides[1].offsetLeft - slides[0].offsetLeft);
        return;
      }

      setStep(slides[0].offsetWidth);
    };

    updateStep();

    const observer = new ResizeObserver(updateStep);
    
    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    return () => observer.disconnect();
  }, [activeGroupIndex]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    viewportRef.current?.setPointerCapture(event.pointerId);

    dragPointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragDeltaXRef.current = 0;
    setDragOffset(0);
    setIsDragging(true);
    setTransitionEnabled(false);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    const delta = event.clientX - dragStartXRef.current;
    const clampedDelta = Math.max(-DRAG_THRESHOLD_MAX, Math.min(DRAG_THRESHOLD_MAX, delta));
    
    dragDeltaXRef.current = clampedDelta;
    setDragOffset(clampedDelta);
  }

  function releasePointer(pointerId: number) {
    if (dragPointerIdRef.current !== pointerId) {
      return;
    }

    dragPointerIdRef.current = null;
    setIsDragging(false);
    setTransitionEnabled(true);

    const absDrag = Math.abs(dragDeltaXRef.current);

    if (absDrag >= DRAG_THRESHOLD_MIN && absDrag <= DRAG_THRESHOLD_MAX) {
      if (dragDeltaXRef.current < 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    setDragOffset(0);
    dragDeltaXRef.current = 0;
  }

  function goToSlide(index: number) {
    if (index < 0) {
      return;
    }

    if (index >= slideCount) {
      return;
    }

    setActiveIndex(index);
  }

  function goToNextSlide() {
    goToSlide(activeIndex + 1);
  }

  function goToPrevSlide() {
    goToSlide(activeIndex - 1);
  }

  function goNext() {
    if (activeIndex < slideCount - 1) {
      goToNextSlide();
      return;
    }

    goToSlide(0);
  }

  function goPrevious() {
    if (activeIndex > 0) {
      goToPrevSlide();
      return;
    }

    goToSlide(slideCount - 1);
  }

  function moveToGroup(groupIndex: number, slideIndex?: number) {
    if (groupIndex < 0 || groupIndex >= groups.length) {
      return;
    }

    setActiveGroupIndex(groupIndex);
    setActiveIndex(slideIndex ?? 0);
  }

  /* [SECCION: TIKTOK_EMBED_COMPONENT] */
  function TikTokEmbed({ url }: { url: string }) {
    const videoId = url.match(/video\/(\d+)/)?.[1] || "";
    const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    
    return (
      <div className="hotel-experience-tiktok-embed">
        <iframe
          title="Video TikTok - Sala de Conferencias"
          src={embedUrl}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "400px",
            border: "none",
            borderRadius: "12px",
          }}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
  }
  /* [FIN_SECCION: TIKTOK_EMBED_COMPONENT] */

  return (
    /* [SECCION: SALA_CONFERENCIAS_SECTION] */
    <section className="scene hotel-deluxe-section hotel-deluxe-experience" id="sala-de-conferencias">
      <div className="hotel-deluxe-section-heading hotel-deluxe-experience-heading">
        <span className="scene-chip">{ui.experience.chip}</span>
        <h2>{renderBalancedSectionTitle(ui.experience.title)}</h2>
        <p>{ui.experience.description}</p>
      </div>

      <div className="hotel-experience-carousel-shell">
        <div className="hotel-experience-carousel-tabs" role="tablist">
          {groups.map((group, index) => (
            <button
              aria-selected={index === activeGroupIndex}
              className={index === activeGroupIndex ? "is-active" : undefined}
              key={group.areaKey}
              onClick={() => moveToGroup(index, 0)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              type="button"
            >
              {group.areaLabel}
            </button>
          ))}
        </div>

        <div className="hotel-experience-carousel-toolbar">
          <div className="hotel-experience-carousel-meta">
            <strong>{currentGroup.areaLabel}</strong>
            <span>
              {currentItems.length} {labels.photos}
            </span>
          </div>

          {hasControls ? (
            <div className="hotel-experience-carousel-controls">
              <button
                aria-label={`${labels.previous}: ${currentGroup.areaLabel}`}
                className="hotel-experience-carousel-button"
                onClick={goPrevious}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                  <path d="M9.75 3.5 5.25 8l4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                </svg>
              </button>
              <button
                aria-label={`${labels.next}: ${currentGroup.areaLabel}`}
                className="hotel-experience-carousel-button"
                onClick={goNext}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                  <path d="M6.25 3.5 10.75 8l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>

        <div
          aria-label={currentGroup.areaLabel}
          aria-roledescription="carousel"
          className={`hotel-experience-carousel-viewport${step > 0 ? " is-ready" : ""}${isDragging ? " is-dragging" : ""}`}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goPrevious();
            }

            if (event.key === "ArrowRight") {
              event.preventDefault();
              goNext();
            }
          }}
          onPointerCancel={(event) => releasePointer(event.pointerId)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => releasePointer(event.pointerId)}
          ref={viewportRef}
          role="region"
          tabIndex={0}
        >
          {hasControls ? (
            <>
              <button
                aria-label={`${labels.previous}: ${currentGroup.areaLabel}`}
                className="hotel-experience-carousel-mobile-arrow is-prev"
                onClick={goPrevious}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                  <path d="M9.75 3.5 5.25 8l4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                </svg>
              </button>
              <button
                aria-label={`${labels.next}: ${currentGroup.areaLabel}`}
                className="hotel-experience-carousel-mobile-arrow is-next"
                onClick={goNext}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                  <path d="M6.25 3.5 10.75 8l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                </svg>
              </button>
            </>
          ) : null}

          <div
            className="hotel-experience-carousel-track"
            ref={trackRef}
            style={{
              transform: `translate3d(${step > 0 ? (-activeIndex * step) + dragOffset : 0}px, 0, 0)`,
              transition: transitionEnabled ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            }}
          >
            {currentItems.map((item, index) => {
              const isCover = index === 0;
              const hasVideo = !!item.embedVideo;

              return (
                <figure
                  className={`hotel-experience-carousel-slide${isCover ? " is-cover" : " is-clean"}${hasVideo ? " has-video" : ""}`}
                  data-experience-slide
                  key={`${currentGroup.areaKey}-${item.id}`}
                >
                  <div className="hotel-experience-carousel-media">
                    {hasVideo ? (
                      <TikTokEmbed url={item.embedVideo!} />
                    ) : (
                      <Image
                        alt={item.alt}
                        className="hotel-experience-carousel-image"
                        draggable={false}
                        fill
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={index === 0}
                        sizes="(max-width: 640px) 94vw, (max-width: 860px) 92vw, (max-width: 1280px) 42vw, 34vw"
                        src={item.src}
                      />
                    )}
                  </div>

                  {isCover ? (
                    <figcaption className="hotel-experience-carousel-cover">
                      <span>{currentGroup.areaLabel}</span>
                      <strong>{item.title}</strong>
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    /* [FIN_SECCION: SALA_CONFERENCIAS_SECTION] */
  );
}
