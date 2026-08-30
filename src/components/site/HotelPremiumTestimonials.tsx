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
            

          </div>
        </figure>
      </div>
    </section>
  );
}
/* [FIN_SECCION: TESTIMONIOS_IMAGEN_ESTATICA] */
