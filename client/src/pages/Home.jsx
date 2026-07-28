import "./styles/Home.css";
import { Link } from "react-router-dom";
import HomeProjectTerminal from "../components/HomeProjectTerminal";
import Preview from "../components/Preview";
import featuredProjects from "../utils/featuredProjects";

const Home = () => (
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

      <HomeProjectTerminal />
    </section>

    <section className="home-projects-title">
      <small>sélection</small>
      <h2>Quelques projets</h2>
      <p>
        Trois projets, trois univers, tous accessibles directement en ligne.
      </p>
    </section>

    <section className="best-projects" aria-label="Projets sélectionnés">
      {featuredProjects.map((project, index) => (
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

export default Home;
