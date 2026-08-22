"use client";

import { renderBalancedSectionTitle } from "./headline-balance";
import type { HotelLocale } from "@/lib/hotel-experience";
import { getHotelUi } from "@/lib/hotel-experience";

type HotelPremiumTestimonialsProps = {
  locale: HotelLocale;
  subtitle: string;
  title: string;
};

/* [SECCION: TESTIMONIOS_TIKTOK_LINK] */
export function HotelPremiumTestimonials({ locale, subtitle, title }: HotelPremiumTestimonialsProps) {
  const ui = getHotelUi(locale);
  
  // Link correcto al perfil del hotel
  const tiktokProfileUrl = "https://www.tiktok.com/@punoterra";
  const tiktokVideoUrl = "https://www.tiktok.com/@germanjohnnydiaztavera/video/7378591800329735429";

  return (
    <section className="scene hotel-deluxe-section hotel-deluxe-testimonials hotel-home-testimonials" id="opiniones">
      <div className="hotel-deluxe-section-heading hotel-home-testimonial-heading">
        <span className="scene-chip">{ui.testimonials.eyebrow}</span>
        <h2>{renderBalancedSectionTitle(title)}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="hotel-tiktok-testimonial-container">
        {/* Video Card con link - evita error 403 de embed */}
        <a 
          href={tiktokVideoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hotel-tiktok-video-card"
        >
          <div className="hotel-tiktok-play-overlay">
            <div className="hotel-tiktok-play-button">
              <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="hotel-tiktok-play-text">
              {locale === "en" ? "Watch on TikTok" : "Ver en TikTok"}
            </span>
          </div>
          
          <div className="hotel-tiktok-video-info">
            <div className="hotel-tiktok-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <div className="hotel-tiktok-meta">
              <strong>@germanjohnnydiaztavera</strong>
              <p>{locale === "en" ? "Hotel Puno Terra Experience" : "Experiencia Hotel Puno Terra"}</p>
            </div>
          </div>
        </a>
        
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
          
          {/* CTA Button - Link CORREGIDO a @punoterra */}
          <a 
            href={tiktokProfileUrl}
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
/* [FIN_SECCION: TESTIMONIOS_TIKTOK_LINK] */
