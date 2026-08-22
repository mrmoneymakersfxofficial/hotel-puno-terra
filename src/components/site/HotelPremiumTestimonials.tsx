"use client";

import { renderBalancedSectionTitle } from "./headline-balance";
import type { HotelLocale } from "@/lib/hotel-experience";
import { getHotelUi } from "@/lib/hotel-experience";

type HotelPremiumTestimonialsProps = {
  locale: HotelLocale;
  subtitle: string;
  title: string;
};

/* [SECCION: TESTIMONIOS_VIDEO_TIKTOK] */
export function HotelPremiumTestimonials({ locale, subtitle, title }: HotelPremiumTestimonialsProps) {
  const ui = getHotelUi(locale);
  
  const tiktokVideoId = "7378591800329735429";
  const embedUrl = `https://www.tiktok.com/embed/v2/${tiktokVideoId}`;

  return (
    <section className="scene hotel-deluxe-section hotel-deluxe-testimonials hotel-home-testimonials" id="opiniones">
      <div className="hotel-deluxe-section-heading hotel-home-testimonial-heading">
        <span className="scene-chip">{ui.testimonials.eyebrow}</span>
        <h2>{renderBalancedSectionTitle(title)}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="hotel-tiktok-testimonial-container">
        <div className="hotel-tiktok-embed-wrapper">
          <iframe
            title="Video TikTok - Experiencia en Hotel Puno Terra"
            src={embedUrl}
            className="hotel-tiktok-iframe"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
            loading="lazy"
          />
        </div>
        
        <div className="hotel-tiktok-testimonial-info">
          <div className="hotel-tiktok-social-proof">
            <span className="hotel-tiktok-badge">
              ★★★★★
            </span>
            <p className="hotel-tiktok-quote">
              {locale === "en" 
                ? "Watch real experiences from our guests at Hotel Puno Terra"
                : "Mira experiencias reales de nuestros huéspedes en Hotel Puno Terra"}
            </p>
          </div>
          
          <a 
            href="https://www.tiktok.com/@germanjohnnydiaztavera/video/7378591800329735429"
            target="_blank"
            rel="noopener noreferrer"
            className="hotel-tiktok-cta-button"
          >
            {locale === "en" ? "View on TikTok" : "Ver en TikTok"} →
          </a>
        </div>
      </div>
    </section>
  );
}
/* [FIN_SECCION: TESTIMONIOS_VIDEO_TIKTOK] */
