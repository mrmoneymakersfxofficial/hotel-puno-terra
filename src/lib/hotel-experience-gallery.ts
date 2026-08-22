import { normalizeHotelSpanishText, type HotelLocale } from "./hotel-experience";

type LocalizedCopy = {
  en: string;
  es: string;
};

type ExperienceGalleryDefinition = {
  alt: LocalizedCopy;
  areaKey: "areas" | "piscina" | "desayuno" | "almuerzo" | "restobar";
  areaLabel: LocalizedCopy;
  id: string;
  src: string;
  title: LocalizedCopy;
};

export type HotelExperienceGalleryItem = {
  alt: string;
  areaKey: ExperienceGalleryDefinition["areaKey"];
  areaLabel: string;
  id: string;
  src: string;
  title: string;
};

const EXPERIENCE_GALLERY_ITEMS: ExperienceGalleryDefinition[] = [
  /* [SECCION: SALA_CONFERENCIAS_CARRUSEL] */
  {
    id: "sala-01",
    areaKey: "areas",
    areaLabel: { es: "Sala de Conferencias", en: "Conference Room" },
    title: { es: "Recepción moderna con estilo Puno Terra", en: "Modern reception with Puno Terra style" },
    alt: { es: "Recepción del hotel con logo y sofas azules", en: "Hotel reception with logo and blue sofas" },
    src: "/assets/gallery/experiencia-curada/01-areas-recepcion.webp",
  },
  {
    id: "sala-02",
    areaKey: "areas",
    areaLabel: { es: "Sala de Conferencias", en: "Conference Room" },
    title: { es: "Patio con cultura viva", en: "Patio with living culture" },
    alt: { es: "Patio interior con huéspedes en traje típico", en: "Inner patio with guests in traditional dress" },
    src: "/assets/gallery/experiencia-curada/02-areas-patio.webp",
  },
  {
    id: "sala-03",
    areaKey: "areas",
    areaLabel: { es: "Sala de Conferencias", en: "Conference Room" },
    title: { es: "Jardín con cascada natural", en: "Garden with natural waterfall" },
    alt: { es: "Jardín interior con cascada y mesas blancas", en: "Inner garden with waterfall and white tables" },
    src: "/assets/gallery/experiencia-curada/03-areas-jardin.webp",
  },
  {
    id: "sala-04",
    areaKey: "areas",
    areaLabel: { es: "Sala de Conferencias", en: "Conference Room" },
    title: { es: "Buffet de desayuno con frutas frescas", en: "Breakfast buffet with fresh fruits" },
    alt: { es: "Buffet de desayuno variado con frutas tropicales", en: "Varied breakfast buffet with tropical fruits" },
    src: "/assets/gallery/experiencia-curada/04-areas-desayuno.webp",
  },
  {
    id: "sala-05",
    areaKey: "areas",
    areaLabel: { es: "Sala de Conferencias", en: "Conference Room" },
    title: { es: "Sala de Conferencias equipada para eventos", en: "Equipped conference room for events" },
    alt: { es: "Sala de conferencias del hotel con proyector y capacidad para grupos", en: "Hotel conference room with projector and group capacity" },
    src: "/assets/gallery/experiencia-curada/05-sala-conferencias.webp",
  },
  /* [FIN_SECCION: SALA_CONFERENCIAS_CARRUSEL] */
];

export function getHotelExperienceGallery(locale: HotelLocale): HotelExperienceGalleryItem[] {
  return EXPERIENCE_GALLERY_ITEMS.map((item) => ({
    alt: locale === "en" ? item.alt.en : normalizeHotelSpanishText(item.alt.es),
    areaKey: item.areaKey,
    areaLabel: locale === "en" ? item.areaLabel.en : normalizeHotelSpanishText(item.areaLabel.es),
    id: item.id,
    src: item.src,
    title: locale === "en" ? item.title.en : normalizeHotelSpanishText(item.title.es),
  }));
}
