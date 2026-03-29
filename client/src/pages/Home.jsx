import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

import Preview from "../components/Preview";

const Home = () => {
  const navigate = useNavigate();

  const projects = [
    {
      name: "LFF – Classements",
      description:
        "LFF est une plateforme web connectée à un serveur Minecraft et à Discord permettant de gérer et afficher des classements dynamiques.",
      stack: ["ReactJS / ExpressJS", "Render / Supabase", "Discord OAuth2"],
      fileName: "lff",
      image:
        "https://media.discordapp.net/attachments/1439248006061887619/1464662526347313276/image.png?ex=69caa8c6&is=69c95746&hm=61fc6dd9c2ebb5cd6ff71ff01ceea8566f0911bc489a58f556daab536fae6d23&=&format=webp&quality=lossless",
    },
    {
      name: "Portfolio",
      description: "Portfolio ReactJS / ExpressJS pour presenter mes projects.",
    },
    {
      name: "Space Invaders",
      description:
        "Recreation d'un Space Invaders version StarWars en C (+ncurses).",
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
