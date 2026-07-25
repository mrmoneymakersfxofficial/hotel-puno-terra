import { HotelBrandLogo } from "./HotelBrandLogo";

type HotelPremiumFooterProps = {
  address: string;
  brandName: string;
  city?: string;
  email?: string;
  phone?: string;
};

export function HotelPremiumFooter({ address, brandName, city, email, phone }: HotelPremiumFooterProps) {
  void address;
  void city;
  void email;
  void phone;

  const fastPageMessage = encodeURIComponent(
    "👋 Hola, vi que ustedes desarrollaron la web del Hotel Puno Terra.\n\nQuisiera una página similar para mi negocio.",
  );
  const fastPageHref = `https://wa.me/51919662011?text=${fastPageMessage}`;

  return (
    <footer className="hotel-deluxe-footer">
      <a className="hotel-deluxe-footer-logo-link" href="/" aria-label={`Ir al inicio de ${brandName}`}>
        <HotelBrandLogo className="hotel-deluxe-footer-logo" sizes="(max-width: 860px) 170px, 200px" width={200} />
      </a>
      <div className="hotel-deluxe-footer-copy">
        <p className="hotel-deluxe-footer-line">{"\u00A9"} 2026 Hotel Puno Terra. Todos los derechos reservados.</p>
        <p className="hotel-deluxe-footer-line">
          Creado & Desarrollado por{" "}
          <a href="https://fastpagepro.com" target="_blank" rel="noopener noreferrer">
            fastpagepro.com
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
