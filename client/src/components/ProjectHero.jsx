import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";

import Button from "./ui/Button";
import { getProjectMeta } from "../utils/projectMeta";
import "./styles/ProjectHero.css";

const ProjectHero = ({ project, formattedDate }) => {
  const { t } = useTranslation();
  const { stack } = getProjectMeta(project.fileName);
  const facts = [t("project.interactive"), formattedDate, ...stack].filter(
    Boolean,
  );

  return (
    <header className="project-hero">
      <Link to="/projects" className="project-hero__back">
        <FiChevronLeft aria-hidden="true" />
        {t("project.back")}
      </Link>
      <div className="project-hero__main">
        <div>
          <h1>{project.name}</h1>
          <p className="project-hero__facts">{facts.join(" · ")}</p>
        </div>
        <Button href={`/api/projects/${project.fileName}`} external>
          {t("project.openTab")}
        </Button>
      </div>
    </header>
  );
};

export default ProjectHero;
