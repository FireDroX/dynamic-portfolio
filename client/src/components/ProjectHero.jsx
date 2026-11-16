import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";

import "./styles/ProjectHero.css";

const ProjectHero = ({ project }) => {
  const { t } = useTranslation();

  return (
    <header className="project-hero">
      <Link to="/projects" className="project-hero__back">
        <FiChevronLeft aria-hidden="true" />
        {t("project.back")}
      </Link>
      <small>{t("project.interactive")}</small>
      <h1>{project.name}</h1>
    </header>
  );
};

export default ProjectHero;
