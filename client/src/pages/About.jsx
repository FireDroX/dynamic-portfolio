import "./styles/About.css";
import { Link } from "react-router";
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

const About = () => (
  <main className="App about-page">
    <header className="about-header">
      <small>portfolio</small>
      <h1>About</h1>
      <p>Quelques mots sur mon parcours et ce que j’utilise pour créer.</p>
    </header>

    <section className="about-summary">
      <div className="about-summary-copy">
        <small>présentation</small>
        <h2>Je construis pour comprendre.</h2>
        <p>
          Je m’appelle Adrien, je suis étudiant en informatique à l’ESGI Paris.
          Je développe principalement des projets web avec React et Node.js,
          mais j’aime aussi sortir de cette stack pour découvrir d’autres
          manières de programmer.
        </p>
        <p>
          Ce portfolio est mon espace d’expérimentation : les projets ne sont
          pas seulement présentés, ils peuvent être testés directement.
        </p>
        <Link to="/projects">Découvrir les projets →</Link>
      </div>

      <dl className="about-facts">
        <div>
          <dt>École</dt>
          <dd>ESGI Paris</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>Web et projets interactifs</dd>
        </div>
        <div>
          <dt>Depuis</dt>
          <dd>{calcDays().toLocaleString("fr-FR")} jours</dd>
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
              Moi
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
              Mes services
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
              Me soutenir
              <SiKofi aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>
    </section>

    <section className="about-stack-section">
      <div className="about-section-title">
        <small>stack</small>
        <h2>Ma boîte à outils</h2>
        <p>Les technologies que j’utilise le plus souvent dans mes projets.</p>
      </div>

      <div className="about-stack-groups">
        {Object.entries(stack).map(([category, technologies]) => (
          <div className="about-stack-group" key={category}>
            <h3>{category}</h3>
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
        <small>activité</small>
        <h2>GitHub</h2>
        <p>Un aperçu de mon activité — et peut-être un secret à trouver.</p>
      </div>
      <button
        type="button"
        className="snake-button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent("portfolio:snake-git"));
        }}
        aria-label="Afficher l’animation des contributions GitHub et découvrir un secret"
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
            alt="Animation des contributions GitHub d’Adrien"
            src="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake-dark.svg"
            loading="lazy"
          />
        </picture>
      </button>
    </section>
  </main>
);

export default About;
