import "./styles/MentionsLegales.css";
import { Trans, useTranslation } from "react-i18next";
import Section from "../components/ui/Section";

const storageEntries = [
  { key: "portfolio_achievements", purpose: "achievements" },
  { key: "portfolio_visited", purpose: "visited" },
  { key: "portfolio_explorer", purpose: "explorer" },
  { key: "portfolio_viewed_projects", purpose: "projects" },
  { key: "portfolio_visit_days", purpose: "days" },
];

const cvDataEntries = ["ip", "userAgent", "referer", "country", "date"];

const cloudflarePolicyLink = (
  <a
    className="link"
    href="https://www.cloudflare.com/privacypolicy/"
    target="_blank"
    rel="noopener noreferrer"
  />
);

const toc = [
  ["edition", "edition"],
  ["hebergement", "hosting"],
  ["confidentialite", "privacy"],
  ["stockage", "storage"],
  ["services", "services"],
  ["propriete", "ownership"],
  ["responsabilite", "liability"],
  ["droits", "rights"],
];

const MentionsLegales = () => {
  const { t } = useTranslation();

  return (
    <main className="legal">
      <Section className="hero legal__hero" data-enter>
        <div className="hero-text hero-copy">
          <p className="legal__eyebrow">{t("legal.eyebrow")}</p>
          <h1>{t("legal.title")}</h1>
          <p className="legal__intro">{t("legal.intro")}</p>
          <time className="legal__updated" dateTime="2026-11-17">
            {t("legal.updated")}
          </time>

          <nav className="legal__toc" aria-label={t("legal.navLabel")}>
            <ol>
              {toc.map(([id, key]) => (
                <li key={id}>
                  <a className="link" href={`#${id}`}>
                    {t(`legal.nav.${key}`)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Section>

      <Section className="legal__body">
        <div className="legal__column">
          <article id="edition">
            <h2>{t("legal.edition.title")}</h2>
            <p>{t("legal.edition.text")}</p>
            <dl className="legal__details">
              <div>
                <dt>{t("legal.edition.publisher")}</dt>
                <dd>Adrien POURLIER</dd>
              </div>
              <div>
                <dt>{t("legal.edition.contact")}</dt>
                <dd>
                  <a className="link" href="mailto:contact@addrien.fr">
                    contact@addrien.fr
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t("legal.edition.sites")}</dt>
                <dd>addrien.fr</dd>
              </div>
            </dl>
          </article>

          <article id="hebergement">
            <h2>{t("legal.hosting.title")}</h2>
            <p>{t("legal.hosting.first")}</p>
            <p>{t("legal.hosting.second")}</p>
          </article>

          <article id="confidentialite">
            <h2>{t("legal.privacy.title")}</h2>
            <p>{t("legal.privacy.first")}</p>
            <p>{t("legal.privacy.second")}</p>
            <h3>{t("legal.privacy.cv.title")}</h3>
            <p>
              <Trans
                i18nKey="legal.privacy.cv.intro"
                components={{ policy: cloudflarePolicyLink }}
              />
            </p>
            <ul>
              {cvDataEntries.map((key) => (
                <li key={key}>{t(`legal.privacy.cv.data.${key}`)}</li>
              ))}
            </ul>
            <p>{t("legal.privacy.cv.purpose")}</p>
            <p className="legal__note">{t("legal.privacy.note")}</p>
          </article>

          <article id="stockage">
            <h2>{t("legal.storage.title")}</h2>
            <p>
              <Trans
                i18nKey="legal.storage.first"
                components={{ storage: <code /> }}
              />
            </p>
            <dl className="legal__details">
              {storageEntries.map((entry) => (
                <div key={entry.key}>
                  <dt>
                    <code>{entry.key}</code>
                  </dt>
                  <dd>{t(`legal.storage.entries.${entry.purpose}`)}</dd>
                </div>
              ))}
            </dl>
            <p>{t("legal.storage.retention")}</p>
            <p>{t("legal.storage.session")}</p>
          </article>

          <article id="services">
            <h2>{t("legal.services.title")}</h2>
            <p>{t("legal.services.intro")}</p>
            <ul>
              <li>
                <strong>Cloudflare</strong>, {t("legal.services.cloudflare")}
              </li>
              <li>
                <strong>Cloudflare Turnstile</strong>,{" "}
                <Trans
                  i18nKey="legal.services.turnstile"
                  components={{ policy: cloudflarePolicyLink }}
                />
              </li>
              <li>
                <strong>url.addrien.fr</strong>, {t("legal.services.urls")}
              </li>
              <li>
                <strong>GitHub</strong>, {t("legal.services.github")}
              </li>
              <li>{t("legal.services.iframes")}</li>
            </ul>
            <p>{t("legal.services.links")}</p>
          </article>

          <article id="propriete">
            <h2>{t("legal.property.title")}</h2>
            <p>{t("legal.property.first")}</p>
            <p>{t("legal.property.second")}</p>
          </article>

          <article id="responsabilite">
            <h2>{t("legal.liability.title")}</h2>
            <p>{t("legal.liability.text")}</p>
          </article>

          <article id="droits">
            <h2>{t("legal.rights.title")}</h2>
            <p>
              {t("legal.rights.beforeEmail")}{" "}
              <a className="link" href="mailto:contact@addrien.fr">
                contact@addrien.fr
              </a>
              .
            </p>
            <ul>
              <li>
                <a
                  className="link"
                  href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("legal.rights.digitalLaw")}
                </a>
              </li>
              <li>
                <a
                  className="link"
                  href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("legal.rights.cnil")}
                </a>
              </li>
            </ul>
          </article>
        </div>
      </Section>
    </main>
  );
};

export default MentionsLegales;
