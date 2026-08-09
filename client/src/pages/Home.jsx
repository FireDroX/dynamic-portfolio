import "./styles/Home.css";
import { Link } from "react-router";
import { Trans, useTranslation } from "react-i18next";
import HomeProjectTerminal from "../components/HomeProjectTerminal";
import Preview from "../components/Preview";
import featuredProjects from "../utils/featuredProjects";

const Home = () => {
  const { t } = useTranslation();

  return (
    <main className="App home-page">
      <header className="home-header">
        <small>portfolio</small>
        <h1>Adrien</h1>
        <p>
          <Trans i18nKey="home.student" components={{ school: <strong /> }} />
        </p>
        <p className="home-online">
          <span aria-hidden="true" />
          {t("home.online")}
        </p>
      </header>

      <section className="home-intro" aria-label={t("home.introLabel")}>
        <div className="home-intro-copy">
          <small>{t("home.whatIDo")}</small>
          <h2>{t("home.title")}</h2>
          <p>{t("home.description")}</p>
          <Link to="/about">{t("home.aboutLink")}</Link>
        </div>

        <HomeProjectTerminal />
      </section>

      <section className="home-projects-title">
        <small>{t("home.selection")}</small>
        <h2>{t("home.projectsTitle")}</h2>
        <p>{t("home.projectsDescription")}</p>
      </section>

      <section
        className="best-projects"
        aria-label={t("home.selectedProjectsLabel")}
      >
        {featuredProjects.map((project, index) => (
          <Preview
            key={project.fileName}
            project={project}
            variant={String(index + 1)}
          />
        ))}
      </section>

      <Link className="see-more" to="/projects">
        {t("home.allProjects")}
      </Link>
    </main>
  );
};

export default Home;
