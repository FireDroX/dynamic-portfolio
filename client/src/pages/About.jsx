import "./styles/About.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FaAws, FaGithub, FaLinkedin } from "react-icons/fa";
import {
  SiCloudflare,
  SiCss,
  SiDocker,
  SiExpress,
  SiFiverr,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiKofi,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const stack = {
  Frontend: [
    { name: "React", Icon: SiReact },
    { name: "JavaScript", Icon: SiJavascript },
    { name: "TypeScript", Icon: SiTypescript },
    { name: "HTML", Icon: SiHtml5 },
    { name: "CSS", Icon: SiCss },
    { name: "Tailwind", Icon: SiTailwindcss },
  ],
  Backend: [
    { name: "Node", Icon: SiNodedotjs },
    { name: "Express", Icon: SiExpress },
    { name: "Nest", Icon: SiNestjs },
    { name: "PHP", Icon: SiPhp },
    { name: "MySQL", Icon: SiMysql },
    { name: "PostgreSQL", Icon: SiPostgresql },
  ],
  Outils: [
    { name: "VS Code", Icon: VscVscode },
    { name: "Docker", Icon: SiDocker },
    { name: "Git", Icon: SiGit },
    { name: "GitHub", Icon: SiGithub },
    { name: "Cloudflare", Icon: SiCloudflare },
    { name: "AWS", Icon: FaAws },
  ],
};

const calcDays = () => {
  const birthDate = new Date("2004-12-13T00:00:00");
  return Math.floor((Date.now() - birthDate.getTime()) / 86400000);
};

const About = () => {
  const { t, i18n } = useTranslation();
  const dayCount = calcDays();
  const locale = i18n.resolvedLanguage === "en" ? "en-GB" : "fr-FR";

  return (
    <main className="App about-page">
      <header className="about-header">
        <small>portfolio</small>
        <h1>{t("about.title")}</h1>
        <p>{t("about.header")}</p>
      </header>

      <section className="about-summary">
        <div className="about-summary-copy">
          <small>{t("about.presentation")}</small>
          <h2>{t("about.summaryTitle")}</h2>
          <p>{t("about.summaryFirst")}</p>
          <p>{t("about.summarySecond")}</p>
          <Link to="/projects">{t("about.discoverProjects")}</Link>
        </div>

        <dl className="about-facts">
          <div>
            <dt>{t("about.school")}</dt>
            <dd>ESGI Paris</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>{t("about.focusValue")}</dd>
          </div>
          <div>
            <dt>{t("about.since")}</dt>
            <dd>
              {t("about.days", {
                count: dayCount,
                formattedCount: dayCount.toLocaleString(locale),
              })}
            </dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd>
              <a
                href="https://github.com/FireDroX"
                target="_blank"
                rel="noopener noreferrer"
              >
                FireDroX
                <FaGithub aria-hidden="true" />
              </a>
            </dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd>
              <a
                href="https://www.linkedin.com/in/adrien-pourlier/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("about.me")}
                <FaLinkedin aria-hidden="true" />
              </a>
            </dd>
          </div>
          <div>
            <dt>Fiverr</dt>
            <dd>
              <a
                href="https://fr.fiverr.com/s/GzV441Z"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("about.services")}
                <SiFiverr aria-hidden="true" />
              </a>
            </dd>
          </div>
          <div>
            <dt>Ko-fi</dt>
            <dd>
              <a
                href="https://ko-fi.com/addrien"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("about.support")}
                <SiKofi aria-hidden="true" />
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="about-stack-section">
        <div className="about-section-title">
          <small>stack</small>
          <h2>{t("about.toolsTitle")}</h2>
          <p>{t("about.toolsDescription")}</p>
        </div>

        <div className="about-stack-groups">
          {Object.entries(stack).map(([category, technologies]) => (
            <div className="about-stack-group" key={category}>
              <h3>
                {category === "Outils" ? t("about.toolsCategory") : category}
              </h3>
              <ul>
                {technologies.map(({ name, Icon }) => (
                  <li key={name}>
                    <Icon aria-hidden="true" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="about-github">
        <div className="about-github-copy">
          <small>{t("about.activity")}</small>
          <h2>GitHub</h2>
          <p>{t("about.githubDescription")}</p>
        </div>
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
      </section>
    </main>
  );
};

export default About;
