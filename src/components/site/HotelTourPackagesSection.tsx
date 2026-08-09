"use client";

import Image from "next/image";
import { useState } from "react";
import { renderBalancedSectionTitle } from "./headline-balance";
import { HOTEL_WHATSAPP_PHONE_DIGITS, type HotelLocale } from "@/lib/hotel-experience";
import { HotelTourPackageDetailModal } from "./HotelTourPackageDetailModal";

type HotelTourPackagesSectionProps = {
  locale: HotelLocale;
  hotelName: string;
};

export type HotelTourPackage = {
  badge: string;
  duration: string;
  imagePosition?: { x?: number; y?: number };
  location: string;
  coverImageSrc?: string;
  includes: string[];
  mediaFiles: string[];
  mediaFolder: string;
  notes?: string[];
  optional?: string[];
  price: string;
  recommendations: string[];
  schedule: string[];
  slug: string;
  summary: string;
  title: string;
};

export function HotelTourPackagesSection({ locale, hotelName }: HotelTourPackagesSectionProps) {
  const copy =
    locale === "en"
      ? {
          badgeLabels: ["Groups", "New", "Featured", "Top sale", "Recommended", "Hot"],
          detailsLabel: "\uD83D\uDD0E VIEW MORE",
          heading: "Tour Packages",
          location: "Peru, Puno",
          starsLabel: "stars",
          whatsappLabel: "Open WhatsApp",
        }
      : {
          badgeLabels: ["Grupos", "Nuevo", "Destacado", "Top venta", "Recomendado", "Popular"],
          detailsLabel: "\uD83D\uDD0E VER M\u00c1S",
          heading: "Paquetes Tur\u00edsticos",
          location: "Peru, Puno",
          starsLabel: "estrellas",
          whatsappLabel: "Abrir WhatsApp",
        };
  const packages = getTourPackages(copy.location, copy.badgeLabels);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activePackage = packages.find((item) => item.slug === activeSlug) || null;

  return (
    <section className="scene hotel-tour-packages-section" id="paquetes-turisticos">
      <div className="hotel-reference-section-heading hotel-tour-packages-heading">
        <span className="scene-chip">{copy.heading}</span>
        <h2>{renderBalancedSectionTitle(copy.heading)}</h2>
      </div>

      <div className="hotel-tour-packages-grid">
        {packages.map((item, index) => {
          const whatsappHref = buildTourPackageWhatsappHref({
            locale,
            hotelName,
            packageName: item.title,
            price: item.price,
            summary: item.summary,
            duration: item.duration,
          });
          const coverImageSrc = item.coverImageSrc || buildTourPackageImagePath(item.mediaFolder, item.mediaFiles[0] || "");

          return (
            <article
              className="hotel-tour-package-card"
              key={`${item.title}-${index + 1}`}
              onClick={() => setActiveSlug(item.slug)}
              style={{ cursor: "pointer" }}
            >
              <div className="hotel-tour-package-media">
                <Image
                  alt={item.title}
                  className="hotel-tour-package-image"
                  fill
                  priority={index < 2}
                  sizes="(max-width: 680px) 92vw, (max-width: 1260px) 31vw, 24vw"
                  src={coverImageSrc}
                  style={getPackageImageStyle(item.imagePosition)}
                />
                <div className="hotel-tour-package-media-overlay" />
                <span className="hotel-tour-package-badge">{item.badge}</span>

                <div className="hotel-tour-package-overlay">
                  <div aria-label={`5 ${copy.starsLabel}`} className="hotel-tour-package-stars">
                    <span>{"\u2605"}</span>
                    <span>{"\u2605"}</span>
                    <span>{"\u2605"}</span>
                    <span>{"\u2605"}</span>
                    <span>{"\u2605"}</span>
                  </div>

                  <h3>
                    {item.title}
                    <small>{item.duration}</small>
                  </h3>

                  <p className="hotel-tour-package-location">
                    <MapPinGlyph />
                    <span>{item.location}</span>
                  </p>

                  <div className="hotel-tour-package-footer">
                    <div className="hotel-tour-package-actions">
                      <a
                        aria-label={copy.whatsappLabel}
                        className="hotel-tour-package-whatsapp"
                        href={whatsappHref}
                        onClick={(e) => e.stopPropagation()}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <WhatsAppGlyph />
                      </a>
                      <button
                        className="hotel-tour-package-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSlug(item.slug);
                        }}
                        type="button"
                      >
                        {copy.detailsLabel}
                      </button>
                    </div>

                    <strong className="hotel-tour-package-price">{item.price}</strong>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <HotelTourPackageDetailModal
        activePackage={activePackage}
        hotelName={hotelName}
        locale={locale}
        onClose={() => setActiveSlug(null)}
      />

      <style jsx global>{`
        .hotel-tour-packages-section {
          width: min(100%, 1320px);
          padding-inline: clamp(16px, 3vw, 24px);
          padding-block: clamp(26px, 4.5vw, 44px);
          margin-inline: auto;
        }

        .hotel-tour-packages-heading {
          margin-bottom: clamp(18px, 3vw, 28px);
        }

        .hotel-tour-packages-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(14px, 1.8vw, 20px);
          width: 100%;
          max-width: 100%;
        }

        .hotel-tour-package-card {
          min-width: 0;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hotel-tour-package-card:hover {
          transform: translateY(-4px);
        }

        .hotel-tour-package-card:hover .hotel-tour-package-media {
          box-shadow: 0 32px 56px rgba(4, 8, 15, 0.3);
        }

        .hotel-tour-package-media {
          position: relative;
          min-height: clamp(300px, 28vw, 350px);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 24px 40px rgba(4, 8, 15, 0.2);
          display: flex;
          align-items: flex-end;
          transition: box-shadow 0.3s ease;
        }

        .hotel-tour-package-image {
          object-fit: cover;
        }

        .hotel-tour-package-media-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(4, 8, 15, 0.02) 14%, rgba(4, 8, 15, 0.46) 58%, rgba(4, 8, 15, 0.94) 100%),
            linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.03));
          pointer-events: none;
        }

        .hotel-tour-package-badge {
          position: absolute;
          left: 0;
          top: 18px;
          z-index: 2;
          min-width: 120px;
          padding: 6px 14px;
          border-radius: 0 9px 9px 0;
          background: linear-gradient(180deg, #ffe42d 0%, #f9d90f 100%);
          color: #0f172a;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.01em;
          text-align: center;
          text-transform: capitalize;
          pointer-events: none;
        }

        .hotel-tour-package-overlay {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 8px;
          width: 100%;
          padding: 18px 16px 16px;
          min-height: 100%;
          pointer-events: none;
        }

        .hotel-tour-package-stars {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #ffd447;
          font-size: 0.8rem;
          line-height: 1;
        }

        .hotel-tour-package-overlay h3 {
          margin: 0;
          display: grid;
          gap: 4px;
          color: #f8fafc;
          font-size: clamp(1.08rem, 1.5vw, 1.7rem);
          font-weight: 800;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .hotel-tour-package-overlay h3 small {
          color: #f8fafc;
          font-size: 0.72em;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .hotel-tour-package-location {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.96);
          font-size: 0.92rem;
          font-weight: 600;
        }

        .hotel-tour-package-location svg {
          flex: none;
          width: 16px;
          height: 16px;
          color: #ffd22f;
        }

        .hotel-tour-package-footer {
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .hotel-tour-package-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          pointer-events: auto;
        }

        .hotel-tour-package-whatsapp {
          flex: none;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 32% 26%, #43e068 0%, #12a732 100%);
          color: #f8fafc;
          box-shadow: 0 8px 20px rgba(18, 167, 50, 0.42);
        }

        .hotel-tour-package-whatsapp svg {
          width: 17px;
          height: 17px;
        }

        .hotel-tour-package-more {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 20px;
          border-radius: 10px;
          background: linear-gradient(180deg, #ffea38 0%, #f7d80f 100%);
          color: #0f172a;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .hotel-tour-package-price {
          flex: none;
          color: #f8fafc;
          font-size: clamp(1.12rem, 1.5vw, 1.55rem);
          font-weight: 900;
          letter-spacing: 0.01em;
          text-align: right;
          text-shadow: 0 6px 14px rgba(0, 0, 0, 0.34);
        }

        @media (min-width: 1024px) {
          .hotel-tour-package-overlay h3 {
            font-size: clamp(0.98rem, 1.22vw, 1.18rem);
            line-height: 1.08;
          }

          .hotel-tour-package-overlay h3 small {
            font-size: 0.68em;
          }

          .hotel-tour-package-price {
            font-size: clamp(1rem, 1.14vw, 1.22rem);
          }
        }

        @media (max-width: 1260px) {
          .hotel-tour-packages-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 940px) {
          .hotel-tour-packages-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .hotel-tour-packages-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .hotel-tour-package-media {
            min-height: clamp(300px, 82vw, 360px);
          }

          .hotel-tour-package-badge {
            top: 14px;
          }

          .hotel-tour-package-overlay {
            padding: 16px 14px 14px;
          }
        }
      `}</style>
    </section>
  );
}

function getTourPackages(location: string, badgeLabels: string[]): HotelTourPackage[] {
  return [
    {
      slug: "islas-flotantes-de-los-uros",
      title: "ISLAS FLOTANTES DE LOS UROS",
      duration: "Medio dia",
      location,
      badge: badgeLabels[0],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-uros", "tour-uros-01.jpg"),
      mediaFolder: "tour-uros",
      mediaFiles: ["tour-uros-01.jpg", "tour-uros-02.jpg", "tour-uros-03.jpg"],
      imagePosition: { x: 50, y: 45 },
      schedule: ["Salida 9:00 am", "Regreso 12:30 pm"],
      recommendations: ["Llevar protector solar y abrigo.", "Cuidar el medio ambiente del lago."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel-puerto-hotel.",
        "Lancha veloz.",
        "Tickets de entrada.",
      ],
      summary:
        "Navega por el lago navegable mas alto del mundo y conoce las famosas islas construidas integramente con totora. Comparte con sus pobladores y descubre una tradicion unica en el mundo.",
    },
    {
      slug: "uros-taquile-full-day",
      title: "UROS + TAQUILE FULL DAY",
      duration: "01D",
      location,
      badge: badgeLabels[1],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-taquile-full", "tour-taquile-full-01.jpg"),
      mediaFolder: "tour-taquile-full",
      mediaFiles: ["tour-taquile-full-01.jpg", "tour-taquile-full-02.jpg"],
      imagePosition: { x: 50, y: 48 },
      schedule: ["Salida 7:00 am", "Regreso 5:30 pm"],
      recommendations: ["Llevar protector solar y abrigo.", "Cuidar el medio ambiente del lago."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel-puerto-hotel.",
        "Lancha veloz.",
        "Tickets de entrada.",
      ],
      summary:
        "Servicio A-1: el tiempo de viaje se reduce a menos de la mitad y permite visitas mas prolongadas, rutas menos frecuentadas y encuentros con familias locales y tejedores. Aprecia la elaboracion de los famosos textiles de Taquile y escucha de los mismos tejedores la interpretacion de su cultura.",
    },
    {
      slug: "uros-amantani-taquile-2-dias",
      title: "UROS + AMANTANI + TAQUILE 2 DIAS",
      duration: "02D",
      location,
      badge: badgeLabels[2],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-amantani", "tour-amantani-01.jpg"),
      mediaFolder: "tour-amantani",
      mediaFiles: ["tour-amantani-01.jpg", "tour-amantani-02.jpg"],
      imagePosition: { x: 50, y: 50 },
      schedule: ["Salida 7:00 am (dia 1)", "Regreso 5:30 pm (dia 2)"],
      recommendations: ["Llevar protector solar y abrigo.", "Cuidar el medio ambiente del lago."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel-puerto-hotel.",
        "Lancha veloz.",
        "Tickets de entrada.",
        "1 noche de hospedaje en casa de familia en Amantani.",
        "Alimentacion.",
      ],
      summary:
        "Experiencia vivencial: convive con los pobladores de Amantani y Tequile, alojandote en casas locales. Caminata al centro ceremonial Pachatata, paisajes alto andinos y atardecer en el Titicaca desde la cima de la isla.",
    },
    {
      slug: "uros-luquina-2-dias",
      title: "UROS + LUQUINA 2 DIAS",
      duration: "02D",
      location,
      badge: badgeLabels[3],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-luquina", "tour-luquina-01.jpg"),
      mediaFolder: "tour-luquina",
      mediaFiles: ["tour-luquina-01.jpg", "tour-luquina-02.jpg"],
      imagePosition: { x: 50, y: 50 },
      schedule: ["Salida 7:00 am (dia 1)", "Regreso 5:30 pm (dia 2)"],
      recommendations: ["Llevar protector solar y abrigo.", "Cuidar el medio ambiente del lago."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel-puerto-hotel.",
        "Lancha veloz.",
        "Tickets de entrada.",
        "1 noche de hospedaje en casa de familia en Luquina.",
        "Alimentacion.",
      ],
      summary:
        "A orillas del Lago Titicaca, visita Luquina con familias aimaras. Comparte sus actividades cotidianas, aprecia flora y fauna local, caminata al mirador Apu Qanicristo y vista privilegiada del Lago Titicaca.",
    },
    {
      slug: "ruta-quechua",
      title: "RUTA QUECHUA",
      duration: "01D",
      location,
      badge: badgeLabels[4],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-ruta-quechua", "tour-ruta-quechua-01.jpg"),
      mediaFolder: "tour-ruta-quechua",
      mediaFiles: [
        "tour-ruta-quechua-01.jpg",
        "tour-ruta-quechua-02.jpg",
        "tour-ruta-quechua-03.jpg",
        "tour-ruta-quechua-04.jpg",
        "tour-ruta-quechua-05.jpg",
      ],
      imagePosition: { x: 50, y: 48 },
      schedule: ["Salida 7:00 am", "Regreso 5:30 pm"],
      recommendations: ["Llevar protector solar y abrigo."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel-.",
        "Tickets de entrada.",
        "Alimentacion.",
      ],
      summary:
        "Visita Sillustani (complejo funerario), La Ciudad Rosada de Lampa (iglesia colonial con copia de La Piedad de Miguel Angel), El Canon de Tinajani en Ayaviri (famoso Kancacho - cordero al horno). Almuerzo tipico y caminata paisajistica.",
    },
    {
      slug: "ruta-aymara",
      title: "RUTA AYMARA",
      duration: "01D",
      location,
      badge: badgeLabels[5],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-ruta-aymara", "tour-ruta-aymara-01.jpg"),
      mediaFolder: "tour-ruta-aymara",
      mediaFiles: [
        "tour-ruta-aymara-01.jpg",
        "tour-ruta-aymara-02.jpg",
        "tour-ruta-aymara-03.jpg",
        "tour-ruta-aymara-04.jpg",
        "tour-ruta-aymara-05.jpg",
        "tour-ruta-aymara-06.jpg",
      ],
      imagePosition: { x: 50, y: 48 },
      schedule: ["Salida 8:00 am", "Regreso 6:00 pm"],
      recommendations: ["Llevar protector solar y abrigo."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel.",
        "Tickets de entrada.",
        "Alimentacion.",
      ],
      summary:
        "Recorrido mistico por la Ruta Aymara: Chucuito (ciudad de las cajas reales y templo de la fertilidad), portal interdimensional de Aramu Muru, y Juli (La pequena Roma de America). Tradiciones, costumbres y forma de vida de la zona Aymara.",
    },
    {
      slug: "kayak-lago-titicaca",
      title: "KAYAK EN EL LAGO TITICACA",
      duration: "Medio dia",
      location,
      badge: badgeLabels[0],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-kayak", "tour-kayak-01.jpg"),
      mediaFolder: "tour-kayak",
      mediaFiles: ["tour-kayak-01.jpg", "tour-kayak-02.jpg"],
      imagePosition: { x: 50, y: 50 },
      schedule: ["Salida 8:00 am", "Previo coordinacion"],
      recommendations: ["Llevar protector solar y abrigo.", "Saber nadar."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel.",
        "Kayak y elementos de seguridad.",
      ],
      summary:
        "Recorre las aguas del Lago Titicaca en kayak, una de las formas mas intimas de conectar con el lago navegable mas alto del mundo. Experiencia guiada con todos los elementos de seguridad.",
    },
    {
      slug: "complejo-arqueologico-de-sillustani",
      title: "COMPLEJO ARQUEOLOGICO DE SILLUSTANI",
      duration: "Medio dia",
      location,
      badge: badgeLabels[3],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("tour-sillustani", "tour-sillustani-01.jpg"),
      mediaFolder: "tour-sillustani",
      mediaFiles: ["tour-sillustani-01.jpg"],
      imagePosition: { x: 50, y: 45 },
      schedule: ["Salidas diarias", "9:00 am", "2:00 pm"],
      recommendations: ["Llevar protector solar y abrigo."],
      includes: [
        "Guia profesional de turismo.",
        "Traslado hotel.",
        "Entradas.",
      ],
      summary:
        "Admira las impresionantes chullpas funerarias preincaicas ubicadas a orillas de la Laguna Umayo, uno de los paisajes mas fotografiados de Puno.",
    },
    {
      slug: "city-tour-puno",
      title: "CITY TOUR PUNO",
      duration: "Medio dia",
      location,
      badge: badgeLabels[1],
      price: "Consultar",
      coverImageSrc: buildTourPackageImagePath("City Tour Puno", "tour-city-tour-01.jpg"),
      mediaFolder: "City Tour Puno",
      mediaFiles: ["tour-city-tour-01.jpg"],
      imagePosition: { x: 50, y: 48 },
      schedule: ["Salidas diarias", "9:00 am", "3:00 pm"],
      recommendations: ["Llevar protector solar y abrigo.", "Calzado comodo para caminata."],
      includes: [
        "Guia turistico oficial.",
        "Transporte ida y vuelta.",
        "Visita a Plaza de Armas de Puno.",
        "Catedral de Puno.",
        "Mirador Kuntur Wasi.",
        "Museo Carlos Dreyer.",
        "Mercado Central.",
      ],
      summary:
        "Recorre los principales atractivos de la ciudad: Plaza de Armas, Catedral de Puno, Mirador Kuntur Wasi, Museo Carlos Dreyer y Mercado Central.",
    },
  ];
}

function buildTourPackageImagePath(folder: string, file: string) {
  return `/${["assets", "gallery", "Paquete tur\u00edstico", folder, file].map((part) => encodeURIComponent(part)).join("/")}`;
}

function buildTourPackageWhatsappHref({
  hotelName,
  locale,
  packageName,
  price,
  summary,
  duration,
}: {
  hotelName: string;
  locale: HotelLocale;
  packageName: string;
  price: string;
  summary: string;
  duration: string;
}) {
  const message =
    locale === "en"
      ? [
          "Hello",
          "I want information and booking details for this tour package:",
          `${packageName} - ${duration}`,
          `Reference price: ${price}`,
          `Summary: ${summary}`,
          `Hotel: ${hotelName}`,
          "Please share availability and payment details.",
        ].join("\n")
      : [
          "Hola",
          "Quiero informacion y reservar este paquete turistico:",
          `${packageName} - ${duration}`,
          `Precio referencial: ${price}`,
          `Resumen: ${summary}`,
          `Hotel: ${hotelName}`,
          "Por favor, comparteme disponibilidad y forma de pago.",
        ].join("\n");

  return `https://api.whatsapp.com/send/?phone=${HOTEL_WHATSAPP_PHONE_DIGITS}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

function getPackageImageStyle(position?: { x?: number; y?: number }) {
  const x = typeof position?.x === "number" ? position.x : 50;
  const y = typeof position?.y === "number" ? position.y : 50;

  return {
    objectPosition: `${x}% ${y}%`,
  };
}

function MapPinGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 2.25a7.25 7.25 0 0 0-7.25 7.25c0 5.2 5.88 11.62 6.13 11.9a1.5 1.5 0 0 0 2.24 0c.25-.28 6.13-6.7 6.13-11.9A7.25 7.25 0 0 0 12 2.25Zm0 9.6a2.35 2.35 0 1 1 0-4.7 2.35 2.35 0 0 1 0 4.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M20.52 3.5A11.7 11.7 0 0 0 2.84 18.16L1.5 22.5l4.48-1.3a11.7 11.7 0 0 0 5.95 1.62h.01A11.7 11.7 0 0 0 20.52 3.5Zm-8.58 17.3h-.01a9.71 9.71 0 0 1-4.95-1.35l-.35-.21-2.66.77.8-2.6-.23-.36a9.74 9.74 0 1 1 7.4 3.75Zm5.34-7.27c-.29-.15-1.74-.86-2.01-.95-.27-.1-.47-.15-.67.14-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.08-.29-.15-1.24-.46-2.35-1.47-.87-.78-1.46-1.75-1.63-2.05-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51l-.57-.01c-.2 0-.51.07-.78.37-.27.29-1.03 1.01-1.03 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.07 3.16 5.02 4.44.7.3 1.24.48 1.67.62.7.22 1.33.19 1.83.12.56-.08 1.74-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z"
        fill="currentColor"
      />
    </svg>
  );
}
