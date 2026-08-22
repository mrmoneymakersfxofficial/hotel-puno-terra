"use client";

import { useRef, useState, useEffect } from "react";
import { renderBalancedSectionTitle } from "./headline-balance";
import type { HotelLocale } from "@/lib/hotel-experience";
import { getHotelUi } from "@/lib/hotel-experience";

type HotelPremiumTestimonialsProps = {
  locale: HotelLocale;
  subtitle: string;
  title: string;
};

/* [SECCION: TESTIMONIOS_VIDEO_LOCAL] */
export function HotelPremiumTestimonials({ locale, subtitle, title }: HotelPremiumTestimonialsProps) {
  const ui = getHotelUi(locale);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load - solo cargar video cuando sea visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="scene hotel-deluxe-section hotel-deluxe-testimonials hotel-home-testimonials" id="opiniones">
      <div className="hotel-deluxe-section-heading hotel-home-testimonial-heading">
        <span className="scene-chip">{ui.testimonials.eyebrow}</span>
        <h2>{renderBalancedSectionTitle(title)}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="hotel-tiktok-testimonial-container">
        {/* Video Player Local Optimizado */}
        <div 
          className={`hotel-video-player-container${isPlaying ? ' is-playing' : ''}`}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            className="hotel-video-player"
            src="/assets/videos/puno-terra-testimonio.mp4"
            poster=""
            preload="none"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedData={() => setIsLoaded(true)}
            onError={(e) => console.error('Video error:', e)}
          />
          
          {/* Play Button Overlay */}
          {!isPlaying && (
            <div className="hotel-video-play-overlay">
              <div className="hotel-video-play-button">
                <svg viewBox="0 0 24 24" fill="currentColor" width="56" height="56">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="hotel-video-play-text">
                {locale === "en" ? "Watch Experience" : "Ver Experiencia"}
              </span>
            </div>
          )}
          
          {/* Video Info Bar */}
          <div className="hotel-video-info-bar">
            <span className="hotel-video-badge">PUNO TERRA</span>
            <span className="hotel-video-duration">0:26</span>
          </div>
        </div>
        
        {/* Social Proof Section */}
        <div className="hotel-tiktok-social-proof">
          <div className="hotel-tiktok-stars-row">
            <span className="hotel-tiktok-star-badge">★★★★★</span>
            <span className="hotel-tiktok-rating-text">
              {locale === "en" ? "5.0 · Exceptional" : "5.0 · Excepcional"}
            </span>
          </div>
          
          <blockquote className="hotel-tiktok-quote">
            &ldquo;{locale === "en" 
              ? "La ubicación super céntrica, la habitación muy amplia, el personal muy amable."
              : "La ubicación super céntrica, la habitación muy amplia, el personal muy amable."}&rdquo;
          </blockquote>
          
          <cite className="hotel-tiktok-author">— Karla, México</cite>
          
          {/* CTA Button - Link a @punoterra */}
          <a 
            href="https://www.tiktok.com/@punoterra"
            target="_blank"
            rel="noopener noreferrer"
            className="hotel-tiktok-cta-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            {locale === "en" ? "Follow us on TikTok" : "Síguenos en TikTok"} →
          </a>
        </div>
      </div>
    </section>
  );
}
/* [FIN_SECCION: TESTIMONIOS_VIDEO_LOCAL] */
