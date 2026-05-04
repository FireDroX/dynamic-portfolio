import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

import Preview from "../components/Preview";

const Home = () => {
  const navigate = useNavigate();

  const projects = [
    {
      name: "PokeFlip Online",
      description:
        'Jeu de mémoire "matching cards" solo et multijoueur temps-reel sur le theme de Pokemon. L\'objectif est de trouver un maximum de paires avant son adversaire.',
      stack: [
        "React.js / Express.js",
        "Socket.io",
        "Docker + Cloudflare Tunnel / SQL Express",
      ],
      fileName: "pokeflip",
      image: "preview1",
    },
    {
      name: "LFF – Classements",
      description:
        "LFF est une plateforme web connectée à un serveur Discord permettant de gérer et afficher des classements dynamiques  hebdomadaire.",
      stack: ["React.js / Express.js", "Render / Supabase", "Discord OAuth2"],
      fileName: "lff",
      image: "preview2",
    },
    {
      name: "Space Invaders",
      description:
        "Space Invaders version StarWars. Pilotez un personnage et évitez les ennemis en utilisant différents vaisseaux. La difficulté du jeu évolue en cinq vagues en fonction du le score de l’utilisateur.",
      stack: ["Langage C / ncurses.h", "StarWars"],
      fileName: "space_invaders",
      image: "preview3",
    },
  ];

  return (
    <div className="App">
      <header>
        <small>portfolio</small>
        <h1>Adrien</h1>
        <p>
          Etudiant en première année à l'<strong>ESGI</strong> Paris.
        </p>
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
