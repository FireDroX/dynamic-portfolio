import "./styles/About.css";
import { Link } from "react-router";

const stack = {
  Frontend: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Bootstrap"],
  Backend: ["Node", "Express", "Nest", "PHP", "MySQL", "PostgreSQL"],
  Outils: ["VS Code", "Docker", "Git", "GitHub", "Cloudflare", "AWS", "Figma"],
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
              FireDroX ↗
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
              Moi ↗
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
              {technologies.map((technology) => (
                <li key={technology}>{technology}</li>
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
