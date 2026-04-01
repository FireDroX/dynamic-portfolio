import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

import Preview from "../components/Preview";

import preview1 from "../assets/preview1.png";
import preview2 from "../assets/preview2.png";
import preview3 from "../assets/preview3.png";

const Home = () => {
  const navigate = useNavigate();

  const projects = [
    {
      name: "Portfolio Dynamique",
      description:
        "Portfolio dynamique permettant d’héberger et afficher des projets web (HTML/CSS/JS) directement via des iframes.",
      stack: ["ReactJS / ExpressJS", "SQLite", "iframes"],
      fileName: "portfolio",
      image: preview1,
    },
    {
      name: "LFF – Classements",
      description:
        "LFF est une plateforme web connectée à un serveur Discord permettant de gérer et afficher des classements dynamiques  hebdomadaire.",
      stack: ["ReactJS / ExpressJS", "Render / Supabase", "Discord OAuth2"],
      fileName: "lff",
      image: preview2,
    },
    {
      name: "Space Invaders",
      description:
        "Space Invaders version StarWars. Pilotez un personnage et évitez les ennemis en utilisant différents vaisseaux. La difficulté du jeu évolue en cinq vagues en fonction du le score de l’utilisateur.",
      stack: ["Langage C / ncurses.h", "StarWars"],
      fileName: "space_invader",
      image: preview3,
    },
  ];

  return (
    <div className="App">
      <header>
        <small>portfolio</small>
        <h1>Adrien</h1>
        <p>Etudiant en informatique.</p>
      </header>
      <div className="blank"></div>
      <section className="best-projects">
        <Preview project={projects[0]} variant="1" />
        <Preview project={projects[1]} variant="2" />
        <Preview project={projects[2]} variant="3" />
      </section>
      <div className="see-more">
        <p onClick={() => navigate("/projects")}>Voir plus de projets.</p>
        <svg
          onClick={() => navigate("/projects")}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default Home;
