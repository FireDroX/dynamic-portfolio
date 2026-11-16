import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";

import Button from "./ui/Button";
import { TechStack } from "./TechPill";
import { getStack } from "../utils/techStack";
import "./styles/ProjectHero.css";

const ProjectHero = ({ project, formattedDate }) => {
  const { t } = useTranslation();
  const facts = [t("project.interactive"), formattedDate].filter(Boolean);

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
          <TechStack
            className="project-hero__stack"
            stack={getStack(project)}
            label={t("stack.label")}
          />
        </div>
        <Button href={`/api/projects/${project.fileName}`} external>
          {t("project.openTab")}
        </Button>
      </div>
    </header>
  );
};

export default ProjectHero;
