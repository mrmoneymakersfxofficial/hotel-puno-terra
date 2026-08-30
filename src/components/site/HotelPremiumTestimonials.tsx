"use client";

import Image from "next/image";
import { renderBalancedSectionTitle } from "./headline-balance";
import type { HotelLocale } from "@/lib/hotel-experience";
import { getHotelUi } from "@/lib/hotel-experience";

type HotelPremiumTestimonialsProps = {
  locale: HotelLocale;
  subtitle: string;
  title: string;
};

/* [SECCION: TESTIMONIOS_IMAGEN_ESTATICA] */
export function HotelPremiumTestimonials({ locale, subtitle, title }: HotelPremiumTestimonialsProps) {
  const ui = getHotelUi(locale);
  

  return (
    <section className="scene hotel-deluxe-section hotel-deluxe-testimonials hotel-home-testimonials" id="opiniones">
      <div className="hotel-deluxe-section-heading hotel-home-testimonial-heading">
        <span className="scene-chip">{ui.testimonials.eyebrow}</span>
        <h2>{renderBalancedSectionTitle(title)}</h2>
        <p>{subtitle}</p>
      </div>

        {/* Imagen Estática del Testimonio */}
        <figure className="hotel-testimonial-image-card">
          <div className="hotel-testimonial-image-wrapper">
            <Image
              src="/assets/gallery/testimonios/testimonio-karla.webp"
              alt={locale === "en" 
                ? "Karla enjoying her stay at Hotel Puno Terra" 
                : "Karla disfrutando su estadía en Hotel Puno Terra"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="hotel-testimonial-image"
            />
            
            {/* Overlay con info */}
            <figcaption className="hotel-testimonial-image-overlay">
            </figcaption>
          </div>
          
          {/* Contenido del testimonio */}
          <div className="hotel-testimonial-content">
            <blockquote className="hotel-testimonial-quote">
              &ldquo;{locale === "en" 
                ? "The location is super central, the room is very spacious, the staff is very friendly."
                : "La ubicación super céntrica, la habitación muy amplia, el personal muy amable."}&rdquo;
            </blockquote>
            
            <div className="hotel-testimonial-author">
              <strong>Karla</strong>
              <span>{locale === "en" ? "Mexico - Booking.com (Feb 2026)" : "México - Booking.com (Feb 2026)"}</span>
            </div>
            
            {/* Badge de verificación */}
            <span className="hotel-testimonial-badge">
              {locale === "en" ? "Verified Guest" : "Huésped Verificado"} ✓
            </span>
            
            <a 
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </figure>
      </div>
    </section>
  );
}
/* [FIN_SECCION: TESTIMONIOS_IMAGEN_ESTATICA] */
