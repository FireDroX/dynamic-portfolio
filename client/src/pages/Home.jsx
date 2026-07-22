import "./styles/Home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Preview from "../components/Preview";

const projects = [
  {
    name: "PokeFlip Online",
    description:
      "Jeu de mémoire jouable en solo ou en multijoueur en temps réel dans l’univers Pokémon.",
    stack: ["React", "Express", "Socket.io", "Docker"],
    fileName: "pokeflip",
    image: "preview1",
  },
  {
    name: "LFF - Classements",
    description:
      "Plateforme connectée à Discord pour gérer et afficher des classements hebdomadaires dynamiques.",
    stack: ["React", "Express", "Supabase", "Discord OAuth2"],
    fileName: "lff",
    image: "preview2",
  },
  {
    name: "Space Invaders",
    description:
      "Réinterprétation en ASCII du classique arcade, développée en C avec une difficulté progressive.",
    stack: ["C", "ncurses"],
    fileName: "space_invaders",
    image: "preview3",
  },
];

const formatProjectDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
};

const Home = () => {
  const [terminalProjects, setTerminalProjects] = useState([]);
  const [terminalLoading, setTerminalLoading] = useState(true);
  const [terminalError, setTerminalError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const data = await response.json();
        setTerminalProjects(
          [...data].sort((a, b) => a.fileName.localeCompare(b.fileName)),
        );
      } catch (error) {
        if (error.name !== "AbortError") setTerminalError(true);
      } finally {
        if (!controller.signal.aborted) setTerminalLoading(false);
      }
    };

    loadProjects();
    return () => controller.abort();
  }, []);

  return (
    <main className="App home-page">
    <header className="home-header">
      <small>portfolio</small>
      <h1>Adrien</h1>
      <p>
        Étudiant à l’<strong>ESGI</strong> Paris et développeur web.
      </p>
      <p className="home-online">
        <span aria-hidden="true" />
        Disponible en ligne
      </p>
    </header>

    <section className="home-intro" aria-label="Introduction">
      <div className="home-intro-copy">
        <small>Ce que je fais</small>
        <h2>Des projets faits pour être utilisés.</h2>
        <p>
          J’aime transformer une idée en quelque chose de concret : une
          interface, un jeu ou un outil que l’on peut directement essayer.
        </p>
        <Link to="/about">En savoir plus sur moi →</Link>
      </div>

      <div className="home-terminal" aria-label="Terminal des projets">
        <div className="home-terminal-title">adrien@portfolio: ~/projects</div>
        <div className="home-terminal-content">
          <p className="home-terminal-command"><span>$</span> ls -lah</p>
          {terminalLoading ? (
            <p className="home-terminal-message">lecture du dossier...</p>
          ) : terminalError ? (
            <p className="home-terminal-message home-terminal-error">
              ls: impossible de lire ~/projects
            </p>
          ) : (
            <div className="home-terminal-list">
              <p className="home-terminal-total">
                total {terminalProjects.length} projet{terminalProjects.length > 1 ? "s" : ""}
              </p>
              {terminalProjects.map((terminalProject) => (
                <Link
                  className="home-terminal-row"
                  to={`/projects/${terminalProject.fileName}`}
                  key={terminalProject.fileName}
                  aria-label={`Ouvrir le projet ${terminalProject.name}`}
                >
                  <span>drwxr-xr-x</span>
                  <span>1</span>
                  <span>adrien</span>
                  <span>4.0K</span>
                  <time dateTime={terminalProject.createdAt}>
                    {formatProjectDate(terminalProject.createdAt)}
                  </time>
                  <strong>{terminalProject.fileName}/</strong>
                </Link>
              ))}
            </div>
          )}
          <p className="home-terminal-command"><span>$</span> <i aria-hidden="true" /></p>
        </div>
      </div>
    </section>

    <section className="home-projects-title">
      <small>sélection</small>
      <h2>Quelques projets</h2>
      <p>Trois projets, trois univers, tous accessibles directement en ligne.</p>
    </section>

    <section className="best-projects" aria-label="Projets sélectionnés">
      {projects.map((project, index) => (
        <Preview
          key={project.fileName}
          project={project}
          variant={String(index + 1)}
        />
      ))}
    </section>

    <Link className="see-more" to="/projects">
      Voir tous les projets →
    </Link>
    </main>
  );
};

export default Home;
