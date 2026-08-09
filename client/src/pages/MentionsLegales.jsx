import "./styles/MentionsLegales.css";
import { Trans, useTranslation } from "react-i18next";

const storageEntries = [
  { key: "portfolio_achievements", purpose: "achievements" },
  { key: "portfolio_visited", purpose: "visited" },
  { key: "portfolio_explorer", purpose: "explorer" },
  { key: "portfolio_viewed_projects", purpose: "projects" },
  { key: "portfolio_visit_days", purpose: "days" },
];

const MentionsLegales = () => {
  const { t } = useTranslation();

  return (
    <main className="App legal-page">
      <header className="legal-header">
        <small>{t("legal.eyebrow")}</small>
        <h1>{t("legal.title")}</h1>
        <p>{t("legal.intro")}</p>
        <time dateTime="2026-07-23">{t("legal.updated")}</time>
      </header>

      <nav className="legal-nav" aria-label={t("legal.navLabel")}>
        <a href="#edition">{t("legal.nav.edition")}</a>
        <a href="#hebergement">{t("legal.nav.hosting")}</a>
        <a href="#confidentialite">{t("legal.nav.privacy")}</a>
        <a href="#stockage">{t("legal.nav.storage")}</a>
        <a href="#services">{t("legal.nav.services")}</a>
        <a href="#droits">{t("legal.nav.rights")}</a>
      </nav>

      <div className="legal-content">
        <section className="legal-section" id="edition">
          <div className="legal-section-title">
            <small>{t("legal.edition.eyebrow")}</small>
            <h2>{t("legal.edition.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>{t("legal.edition.text")}</p>
            <dl className="legal-details">
              <div>
                <dt>{t("legal.edition.publisher")}</dt>
                <dd>Adrien POURLIER</dd>
              </div>
              <div>
                <dt>{t("legal.edition.contact")}</dt>
                <dd>
                  <a href="mailto:contact@addrien.fr">contact@addrien.fr</a>
                </dd>
              </div>
              <div>
                <dt>{t("legal.edition.sites")}</dt>
                <dd>addrien.fr · portfolio.addrien.fr</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="legal-section" id="hebergement">
          <div className="legal-section-title">
            <small>{t("legal.hosting.eyebrow")}</small>
            <h2>{t("legal.hosting.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>{t("legal.hosting.first")}</p>
            <p>{t("legal.hosting.second")}</p>
          </div>
        </section>

        <section className="legal-section" id="confidentialite">
          <div className="legal-section-title">
            <small>{t("legal.privacy.eyebrow")}</small>
            <h2>{t("legal.privacy.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>{t("legal.privacy.first")}</p>
            <p>{t("legal.privacy.second")}</p>
            <aside className="legal-note">{t("legal.privacy.note")}</aside>
          </div>
        </section>

        <section className="legal-section" id="stockage">
          <div className="legal-section-title">
            <small>{t("legal.storage.eyebrow")}</small>
            <h2>{t("legal.storage.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>
              <Trans
                i18nKey="legal.storage.first"
                components={{ storage: <code /> }}
              />
            </p>
            <div className="legal-storage-list">
              {storageEntries.map((entry) => (
                <div key={entry.key}>
                  <code>{entry.key}</code>
                  <p>{t(`legal.storage.entries.${entry.purpose}`)}</p>
                </div>
              ))}
            </div>
            <p>{t("legal.storage.retention")}</p>
            <p>{t("legal.storage.session")}</p>
          </div>
        </section>

        <section className="legal-section" id="services">
          <div className="legal-section-title">
            <small>{t("legal.services.eyebrow")}</small>
            <h2>{t("legal.services.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>{t("legal.services.intro")}</p>
            <ul className="legal-list">
              <li>
                <strong>Cloudflare</strong>, {t("legal.services.cloudflare")}
              </li>
              <li>
                <strong>Google Fonts</strong>, {t("legal.services.fonts")}
              </li>
              <li>
                <strong>GitHub</strong>, {t("legal.services.github")}
              </li>
              <li>{t("legal.services.iframes")}</li>
            </ul>
            <p>{t("legal.services.links")}</p>
          </div>
        </section>

        <section className="legal-section" id="propriete">
          <div className="legal-section-title">
            <small>{t("legal.property.eyebrow")}</small>
            <h2>{t("legal.property.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>{t("legal.property.first")}</p>
            <p>{t("legal.property.second")}</p>
          </div>
        </section>

        <section className="legal-section" id="responsabilite">
          <div className="legal-section-title">
            <small>{t("legal.liability.eyebrow")}</small>
            <h2>{t("legal.liability.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>{t("legal.liability.text")}</p>
          </div>
        </section>

        <section className="legal-section" id="droits">
          <div className="legal-section-title">
            <small>{t("legal.rights.eyebrow")}</small>
            <h2>{t("legal.rights.title")}</h2>
          </div>
          <div className="legal-section-body">
            <p>
              {t("legal.rights.beforeEmail")}{" "}
              <a href="mailto:contact@addrien.fr">contact@addrien.fr</a>.
            </p>
            <div className="legal-references">
              <a
                href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("legal.rights.digitalLaw")}
              </a>
              <a
                href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("legal.rights.cnil")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MentionsLegales;
