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
  /* [SECCION: AREAS_COMUNES_CARRUSEL] - Imagenes actualizadas */
  {
    id: "areas-01",
    areaKey: "areas",
    areaLabel: { es: "Areas comunes", en: "Common areas" },
    title: { es: "Recepción moderna con estilo Puno Terra", en: "Modern reception with Puno Terra style" },
    alt: { es: "Recepción del hotel con logo y sofas azules", en: "Hotel reception with logo and blue sofas" },
    src: "/assets/gallery/experiencia-curada/01-areas-recepcion.webp",
  },
  {
    id: "areas-02",
    areaKey: "areas",
    areaLabel: { es: "Areas comunes", en: "Common areas" },
    title: { es: "Patio con cultura viva", en: "Patio with living culture" },
    alt: { es: "Patio interior con huéspedes en traje típico", en: "Inner patio with guests in traditional dress" },
    src: "/assets/gallery/experiencia-curada/02-areas-patio.webp",
  },
  {
    id: "areas-03",
    areaKey: "areas",
    areaLabel: { es: "Areas comunes", en: "Common areas" },
    title: { es: "Jardín con cascada natural", en: "Garden with natural waterfall" },
    alt: { es: "Jardín interior con cascada y mesas blancas", en: "Inner garden with waterfall and white tables" },
    src: "/assets/gallery/experiencia-curada/03-areas-jardin.webp",
  },
  {
    id: "areas-04",
    areaKey: "areas",
    areaLabel: { es: "Areas comunes", en: "Common areas" },
    title: { es: "Buffet de desayuno con frutas frescas", en: "Breakfast buffet with fresh fruits" },
    alt: { es: "Buffet de desayuno variado con frutas tropicales", en: "Varied breakfast buffet with tropical fruits" },
    src: "/assets/gallery/experiencia-curada/04-areas-desayuno.webp",
  },
  {
    id: "areas-05",
    areaKey: "areas",
    areaLabel: { es: "Areas comunes", en: "Common areas" },
    title: { es: "Comedor servido para un desayuno completo", en: "Dining room served for complete breakfast" },
    alt: { es: "Comedor del hotel con desayuno servido", en: "Hotel dining room with breakfast served" },
    src: "/assets/gallery/experiencia-curada/05-areas-comedor.webp",
  },
  /* [FIN_SECCION: AREAS_COMUNES_CARRUSEL] */
  {
    id: "piscina-01",
    areaKey: "piscina",
    areaLabel: { es: "Piscina", en: "Pool" },
    title: { es: "Descanso tropical junto al agua", en: "Tropical rest by the water" },
    alt: { es: "Descanso junto a la piscina del hotel", en: "Relaxing spot by the hotel pool" },
    src: "/assets/gallery/experiencia-curada/06-piscina-descanso.jpg",
  },
  {
    id: "piscina-02",
    areaKey: "piscina",
    areaLabel: { es: "Piscina", en: "Pool" },
    title: { es: "Piscina azul para bajar el ritmo", en: "Blue pool to slow the pace" },
    alt: { es: "Vista superior de la piscina del hotel", en: "Top view of the hotel pool" },
    src: "/assets/gallery/experiencia-curada/05-piscina-vista.jpg",
  },
  {
    id: "desayuno-01",
    areaKey: "desayuno",
    areaLabel: { es: "Desayuno", en: "Breakfast" },
    title: { es: "Mananas con mas calma", en: "Mornings with more calm" },
    alt: { es: "Bandeja de desayuno del hotel", en: "Hotel breakfast tray" },
    src: "/assets/gallery/experiencia-curada/10-desayuno-bandeja.jpg",
  },
  {
    id: "desayuno-02",
    areaKey: "desayuno",
    areaLabel: { es: "Desayuno", en: "Breakfast" },
    title: { es: "Buffet listo desde temprano", en: "Buffet ready from early on" },
    alt: { es: "Mesa de desayuno lista", en: "Breakfast table ready" },
    src: "/assets/gallery/experiencia-curada/11-desayuno-buffet.jpg",
  },
  {
    id: "desayuno-03",
    areaKey: "desayuno",
    areaLabel: { es: "Desayuno", en: "Breakfast" },
    title: { es: "Desayuno servido con calma", en: "Breakfast served at an easy pace" },
    alt: { es: "Servicio de desayuno en el hotel", en: "Breakfast service at the hotel" },
    src: "/assets/gallery/experiencia-curada/09-desayuno-servicio.jpg",
  },
  {
    id: "desayuno-04",
    areaKey: "desayuno",
    areaLabel: { es: "Desayuno", en: "Breakfast" },
    title: { es: "Salon para desayunar sin apuro", en: "Breakfast hall without the rush" },
    alt: { es: "Salon de desayuno del hotel", en: "Hotel breakfast hall" },
    src: "/assets/gallery/experiencia-curada/12-desayuno-salon.jpg",
  },
  {
    id: "almuerzo-01",
    areaKey: "almuerzo",
    areaLabel: { es: "Almuerzo", en: "Lunch" },
    title: { es: "Sabores regionales sin apuro", en: "Regional flavors without the rush" },
    alt: { es: "Plato de almuerzo del hotel", en: "Hotel lunch dish" },
    src: "/assets/gallery/experiencia-curada/15-almuerzo-plato.jpg",
  },
  {
    id: "almuerzo-02",
    areaKey: "almuerzo",
    areaLabel: { es: "Almuerzo", en: "Lunch" },
    title: { es: "Mesa lista para una pausa larga", en: "Table ready for a longer pause" },
    alt: { es: "Mesa de almuerzo dentro del hotel", en: "Lunch table inside the hotel" },
    src: "/assets/gallery/experiencia-curada/14-almuerzo-mesa.jpg",
  },
  {
    id: "almuerzo-03",
    areaKey: "almuerzo",
    areaLabel: { es: "Almuerzo", en: "Lunch" },
    title: { es: "Almuerzo con sabor regional", en: "Lunch with regional flavor" },
    alt: { es: "Huesped almorzando en el hotel", en: "Guest having lunch at the hotel" },
    src: "/assets/gallery/experiencia-curada/13-almuerzo-cliente.jpg",
  },
  {
    id: "almuerzo-04",
    areaKey: "almuerzo",
    areaLabel: { es: "Almuerzo", en: "Lunch" },
    title: { es: "Sabores frescos para compartir", en: "Fresh flavors to share" },
    alt: { es: "Entrada o piqueo del hotel", en: "Starter or snack at the hotel" },
    src: "/assets/gallery/experiencia-curada/16-almuerzo-sabores.jpg",
  },
  {
    id: "restobar-01",
    areaKey: "restobar",
    areaLabel: { es: "Restobar", en: "Restobar" },
    title: { es: "Cocteles para cerrar el dia", en: "Cocktails to close the day" },
    alt: { es: "Coctel del restobar del hotel", en: "Hotel restobar cocktail" },
    src: "/assets/gallery/experiencia-curada/17-restobar-coctel.jpg",
  },
  {
    id: "restobar-02",
    areaKey: "restobar",
    areaLabel: { es: "Restobar", en: "Restobar" },
    title: { es: "Brindis fresco en la noche", en: "Fresh toast at night" },
    alt: { es: "Bebidas del restobar del hotel", en: "Drinks at the hotel restobar" },
    src: "/assets/gallery/experiencia-curada/18-restobar-brindis.jpg",
  },
  {
    id: "restobar-03",
    areaKey: "restobar",
    areaLabel: { es: "Restobar", en: "Restobar" },
    title: { es: "Carta ligera junto a la piscina", en: "Light menu by the pool" },
    alt: { es: "Bebida del restobar junto a la piscina", en: "Restobar drink by the pool" },
    src: "/assets/gallery/experiencia-curada/19-restobar-carta.jpg",
  },
  {
    id: "restobar-04",
    areaKey: "restobar",
    areaLabel: { es: "Restobar", en: "Restobar" },
    title: { es: "Ambiente nocturno con restobar", en: "Night atmosphere with restobar" },
    alt: { es: "Restobar del hotel durante la noche", en: "Hotel restobar at night" },
    src: "/assets/gallery/experiencia-curada/20-restobar-noche.jpg",
  },
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
