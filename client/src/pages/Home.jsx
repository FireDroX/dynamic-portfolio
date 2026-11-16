import "./styles/Home.css";
import "../styles/icons.css";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import CvButton from "../components/CvButton";
import HomeProjectTerminal from "../components/HomeProjectTerminal";
import Preview from "../components/Preview";
import useHeroEffect from "../hooks/useHeroEffect";
import { getCvUrl } from "../utils/cv";
import featuredProjects from "../utils/featuredProjects";

const LINKEDIN_URL = "https://www.linkedin.com/in/adrien-pourlier/";
const GITHUB_URL = "https://github.com/FireDroX";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" };

const facts = ["School", "Stack", "Date", "Rhythm"];

const Home = () => {
  const { t, i18n } = useTranslation();
  const contactLinks = [
    {
      key: "linkedin",
      name: "LinkedIn",
      detail: "adrien-pourlier",
      href: LINKEDIN_URL,
      icon: "linkedin",
    },
    {
      key: "github",
      name: "GitHub",
      detail: "FireDroX",
      href: GITHUB_URL,
      icon: "github",
      extra: "ic-ink",
    },
    {
      key: "cv",
      name: t("home.cvButton"),
      href: getCvUrl(i18n.resolvedLanguage),
      icon: "ui-download",
      extra: "ic-ink",
    },
  ];
  const heroRef = useRef(null);
  useHeroEffect(heroRef);

  return (
    <main className="home-page">
      <section
        className="hero hero--statement home-hero"
        data-enter
        aria-labelledby="home-hero-title"
      >
        <picture
          ref={heroRef}
          className="hero__bg home-hero__fx"
          data-fx="painterly-landscape"
          aria-hidden="true"
        />
        <div className="wrap">
          <div className="hero-text hero__in">
            <div>
              <p className="home-online">
                {t("home.online")}
                <span aria-hidden="true" />
              </p>
              <h1 id="home-hero-title">
                <span className="home-hero__name">Adrien</span>
                <span className="home-hero__role">{t("home.role")}</span>
              </h1>
              <p className="hero__lead">{t("home.lead")}</p>
              <div className="btn-row">
                <Button to="/projects">{t("home.projectsButton")}</Button>
                <CvButton variant="secondary" />
              </div>
            </div>
            <dl className="hero__facts" aria-label={t("home.factsLabel")}>
              {facts.map((fact) => (
                <div key={fact}>
                  <dt>{t(`home.fact${fact}`)}</dt>
                  <dd>{t(`home.fact${fact}Value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Section id="terminal">
        <div className="section-head">
          <h2>{t("home.terminalTitle")}</h2>
          <p>{t("home.terminalText")}</p>
        </div>
        <HomeProjectTerminal />
      </Section>

      <Section id="selection">
        <div className="section-head section-head--row">
          <div>
            <h2>{t("home.selectionTitle")}</h2>
            <p>{t("home.selectionText")}</p>
          </div>
          <Button to="/projects" variant="secondary">
            {t("home.allProjects")}
          </Button>
        </div>
        <ul
          className="home-selection"
          aria-label={t("home.selectedProjectsLabel")}
        >
          {featuredProjects.map((project) => (
            <li key={project.fileName}>
              <Preview project={project} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contact" className="home-contact">
        <div className="grid home-contact__grid">
          <div className="closing__cta close--type span-6">
            <div className="section-head">
              <h2>{t("home.contactTitle")}</h2>
              <p>{t("home.contactText")}</p>
            </div>
            <Button href="mailto:contact@addrien.fr">
              {t("home.contactMail")}
            </Button>
          </div>
          <Card className="home-contact__card span-6 start-7">
            <ul>
              {contactLinks.map(({ key, name, detail, href, icon, extra = "" }) => (
                <li key={key}>
                  <a href={href} {...EXTERNAL}>
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
                      {detail && <small>{detail}</small>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
    </main>
  );
};

export default Home;
