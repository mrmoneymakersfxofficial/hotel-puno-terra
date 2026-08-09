import Image from "next/image";
import { renderBalancedSectionTitle } from "./headline-balance";
import { HotelBrandLogo } from "./HotelBrandLogo";
import type { HotelLocale } from "@/lib/hotel-experience";

type HotelPaymentMethodsSectionProps = {
  locale: HotelLocale;
};

export function HotelPaymentMethodsSection({ locale }: HotelPaymentMethodsSectionProps) {
  const copy =
    locale === "en"
      ? {
          heading: "Payment Methods",
          accountLabel: "BCP checking account in soles",
          cciLabel: "CCI",
          legalNameLabel: "Legal name",
          rucLabel: "RUC",
          acceptedMethodsLabel: "Accepted payment methods",
          creditCardLabel: "Credit card",
          yapeLabel: "Yape",
          plinLabel: "Plin",
          bankTransferLabel: "Bank transfer (BCP)",
        }
      : {
          heading: "M\u00e9todos de Pago",
          accountLabel: "CTA CORRIENTE BCP SOLES",
          cciLabel: "CCI",
          legalNameLabel: "RAZ\u00d3N SOCIAL",
          rucLabel: "RUC",
          acceptedMethodsLabel: "M\u00e9todos de pago aceptados",
          creditCardLabel: "Tarjeta de cr\u00e9dito",
          yapeLabel: "Yape",
          plinLabel: "Plin",
          bankTransferLabel: "Transferencia bancaria (BCP)",
        };

  return (
    <section className="scene hotel-payment-methods-section" id="metodos-pago">
      <div className="hotel-reference-section-heading hotel-payment-methods-heading">
        <span className="scene-chip">{copy.heading}</span>
        <h2>{renderBalancedSectionTitle(copy.heading)}</h2>
      </div>

      <article className="hotel-payment-method-card">
        <header className="hotel-payment-method-brand">
          <HotelBrandLogo className="hotel-payment-brand-logo" />
        </header>

        <div className="hotel-payment-method-body">
          <p>
            <strong>{copy.rucLabel}:</strong> Consultar
          </p>
          <p>
            <strong>{copy.legalNameLabel}:</strong> Hotel Puno Terra
          </p>
          <div className="hotel-payment-bank-logo-wrap" aria-label="BCP">
            <Image
              alt="Logo BCP"
              className="hotel-payment-bank-logo"
              decoding="async"
              height={129}
              loading="lazy"
              src="/assets/payments/bcp-logo.svg"
              width={512}
            />
          </div>
          <p>
            <strong>{copy.accountLabel}:</strong> Consultar al hotel
          </p>
          <p>
            <strong>{copy.cciLabel}:</strong> Consultar al hotel
          </p>
        </div>
      </article>

      <div className="hotel-payment-accepted-methods" aria-label={copy.acceptedMethodsLabel}>
        <span className="hotel-payment-accepted-label">{copy.acceptedMethodsLabel}:</span>
        <ul className="hotel-payment-accepted-list" role="list">
          <li>{copy.creditCardLabel}</li>
          <li>{copy.yapeLabel}</li>
          <li>{copy.plinLabel}</li>
          <li>{copy.bankTransferLabel}</li>
        </ul>
      </div>

      <style jsx global>{`
        .hotel-payment-methods-section {
          width: min(100%, 1320px);
          margin-inline: auto;
          padding-inline: clamp(16px, 3vw, 24px);
          padding-block: clamp(16px, 3vw, 28px) clamp(28px, 4vw, 40px);
        }

        .hotel-payment-methods-heading {
          margin-bottom: clamp(16px, 2.2vw, 22px);
        }

        .hotel-payment-method-card {
          margin: 0;
          padding: clamp(18px, 2.4vw, 24px);
          border-radius: 24px;
          background: #ececec;
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
        }

        .hotel-payment-method-brand {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .hotel-payment-brand-logo {
          width: clamp(148px, 20vw, 190px);
          max-width: 100%;
        }

        .hotel-payment-method-body {
          display: grid;
          gap: 10px;
          text-align: center;
          color: #111827;
        }

        .hotel-payment-method-body p {
          margin: 0;
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          line-height: 1.45;
        }

        .hotel-payment-method-body strong {
          font-weight: 900;
          letter-spacing: 0.01em;
        }

        .hotel-payment-bank-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px auto 10px;
          width: 100%;
        }

        .hotel-payment-bank-logo {
          width: clamp(120px, 18vw, 180px);
          height: auto;
          max-width: 100%;
        }

        .hotel-payment-accepted-methods {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px 12px;
          margin: clamp(16px, 2.4vw, 24px) auto 0;
          padding: clamp(14px, 2vw, 20px) clamp(16px, 2.4vw, 24px);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(15, 23, 42, 0.06);
          max-width: 720px;
        }

        .hotel-payment-accepted-label {
          font-weight: 700;
          color: #111827;
          font-size: clamp(0.9rem, 1.2vw, 1rem);
        }

        .hotel-payment-accepted-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 10px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .hotel-payment-accepted-list li {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 999px;
          background: #1f2937;
          color: #ffffff;
          font-size: clamp(0.82rem, 1.05vw, 0.92rem);
          font-weight: 600;
          letter-spacing: 0.01em;
        }
      `}</style>
    </section>
  );
}
