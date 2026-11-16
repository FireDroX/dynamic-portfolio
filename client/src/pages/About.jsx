import "./styles/About.css";
import "../styles/icons.css";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import CvButton from "../components/CvButton";
import PortfolioDiagram from "../components/PortfolioDiagram";

const stack = {
  Frontend: [
    { name: "React", icon: "react" },
    { name: "JavaScript", icon: "javascript" },
    { name: "TypeScript", icon: "typescript" },
    { name: "HTML", icon: "html-5", extra: "ic-tall" },
    { name: "CSS", icon: "css" },
    { name: "Tailwind", icon: "tailwindcss", extra: "ic-land" },
  ],
  Backend: [
    { name: "Node", icon: "nodejs" },
    { name: "Express", icon: "si-express", extra: "ic-land ic-ink" },
    { name: "Nest", icon: "nestjs" },
    { name: "PHP", icon: "php", extra: "ic-wide" },
    { name: "MySQL", icon: "si-mysql", extra: "ic-land" },
    { name: "PostgreSQL", icon: "postgres" },
  ],
  Outils: [
    { name: "VS Code", icon: "visual-studio-code" },
    { name: "Docker", icon: "docker", extra: "ic-land" },
    { name: "Git", icon: "git" },
    { name: "GitHub", icon: "github", extra: "ic-ink" },
    { name: "Cloudflare", icon: "cloudflare", extra: "ic-wide" },
    { name: "WebStorm", icon: "webstorm" },
  ],
};

const links = [
  {
    name: "GitHub",
    label: "FireDroX",
    href: "https://github.com/FireDroX",
    icon: "github",
    extra: "ic-ink",
  },
  {
    name: "LinkedIn",
    labelKey: "about.me",
    href: "https://www.linkedin.com/in/adrien-pourlier/",
    icon: "linkedin",
  },
  {
    name: "Fiverr",
    labelKey: "about.services",
    href: "https://fr.fiverr.com/s/GzV441Z",
    icon: "fiverr",
    extra: "ic-wide",
  },
  {
    name: "Ko-fi",
    labelKey: "about.support",
    href: "https://ko-fi.com/addrien",
    icon: "kofi",
    extra: "ic-land",
  },
];

const PATH_STEPS = [
  { id: "bac", kind: "education" },
  { id: "but", kind: "education" },
  { id: "esgi", kind: "education" },
  { id: "internship", kind: "experience", stack: true },
  { id: "work", kind: "next" },
];

const calcDays = () => {
  const birthDate = new Date("2004-12-13T00:00:00");
  return Math.floor((Date.now() - birthDate.getTime()) / 86400000);
};

const About = () => {
  const { t, i18n } = useTranslation();
  const dayCount = calcDays();
  const locale = i18n.resolvedLanguage === "en" ? "en-GB" : "fr-FR";

  return (
    <main className="about-page">
      <section
        className="hero"
        data-enter
        aria-labelledby="about-hero-title"
      >
        <div className="wrap">
          <div className="hero-text grid hero__grid">
            <div className="hero__text span-8">
              <p className="hero__kicker">{t("about.title")}</p>
              <h1 id="about-hero-title">{t("about.intro")}</h1>
              <p className="hero__lead">{t("about.summaryFirst")}</p>
              <p className="hero__lead muted">{t("about.summarySecond")}</p>
              <div className="btn-row">
                <Button to="/projects">{t("home.projectsButton")}</Button>
                <CvButton variant="secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="parcours">
        <div className="grid about-split">
          <div className="span-6">
            <div className="section-head">
              <h2>{t("about.pathTitle")}</h2>
              <p>{t("about.pathText")}</p>
            </div>
            <ol className="about-path">
              {PATH_STEPS.map(({ id, kind, stack: hasStack }) => (
                <li key={id} className={`about-path__step about-path__step--${kind}`}>
                  <p className="about-path__meta">
                    <span className="about-path__kind">
                      {t(`about.pathKinds.${kind}`)}
                    </span>
                    <span>{t(`about.path.${id}.place`)}</span>
                    <span>{t(`about.path.${id}.period`)}</span>
                  </p>
                  <p className="about-path__title">
                    {t(`about.path.${id}.title`)}
                  </p>
                  <p>{t(`about.path.${id}.text`)}</p>
                  {hasStack && (
                    <p className="about-path__stack">
                      {t(`about.path.${id}.stack`)}
                    </p>
                  )}
                </li>
              ))}
            </ol>
            <p className="about-days">
              {t("about.since")}{" "}
              <strong>
                {t("about.days", {
                  count: dayCount,
                  formattedCount: dayCount.toLocaleString(locale),
                })}
              </strong>
            </p>
          </div>

          <div
            id="stack"
            className="about-stack span-6 start-7"
            data-ui="stack"
          >
            {Object.entries(stack).map(([category, tools]) => (
              <div className="about-stack__group" key={category}>
                <p className="about-stack__label" id={`stack-${category}`}>
                  {category === "Outils" ? t("about.toolsCategory") : category}
                </p>
                <ul aria-labelledby={`stack-${category}`}>
                  {tools.map(({ name, icon, extra = "" }) => (
                    <li key={name}>
                      <img
                        className={`ic ic-32 ${extra}`.trim()}
                        src={`/assets/icons/${icon}.svg`}
                        alt=""
                        width="32"
                        height="32"
                        loading="lazy"
                      />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="about-marks">{t("about.marks")}</p>
          </div>
        </div>
      </Section>

      <Section id="portfolio">
        <div className="section-head">
          <h2>{t("about.portfolioTitle")}</h2>
          <p>{t("about.portfolioText")}</p>
        </div>
        <Card className="about-diagram">
          <div className="panel">
            <PortfolioDiagram />
          </div>
        </Card>
      </Section>

      <Section id="liens">
        <div className="grid about-links">
          <div className="span-6">
            <div className="section-head">
              <h2>{t("about.linksTitle")}</h2>
              <p>{t("about.linksText")}</p>
            </div>
            <ul className="about-links__list">
              {links.map(({ name, label, labelKey, href, icon, extra = "" }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <img
                      className={`ic ic-28 ${extra}`.trim()}
                      src={`/assets/icons/${icon}.svg`}
                      alt=""
                      width="28"
                      height="28"
                      loading="lazy"
                    />
                    <span>
                      <strong>{name}</strong>
                      <small>{label ?? t(labelKey)}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="about-links__side span-6 start-7">
            <div className="about-github" data-ui="github">
              <p>{t("about.githubDescription")}</p>
              <button
                type="button"
                className="snake-button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("portfolio:snake-git"));
                }}
                aria-label={t("about.githubButtonLabel")}
              >
                <picture>
                  <source
                    media="(prefers-color-scheme: dark)"
                    srcSet="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake-dark.svg"
                  />
                  <source
                    media="(prefers-color-scheme: light)"
                    srcSet="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake.svg"
                  />
                  <img
                    className="snake-svg"
                    alt={t("about.githubImageAlt")}
                    src="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake-dark.svg"
                    loading="lazy"
                  />
                </picture>
              </button>
            </div>
            <div className="btn-row about-links__cta">
              <Button href="mailto:contact@addrien.fr">
                {t("home.contactMail")}
              </Button>
              <CvButton variant="secondary" />
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default About;
