import "./styles/ProjectDetail.css";
import { Navigate, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import ProjectHero from "../components/ProjectHero";
import ProjectLivePreview from "../components/ProjectLivePreview";
import Seo from "../components/Seo";
import useProjectDetails from "../hooks/useProjectDetails";
import getProjectDescription from "../utils/projectDescription";

const ProjectDetail = () => {
  const { t, i18n } = useTranslation();
  const { project: projectSlug } = useParams();
  const navigate = useNavigate();
  const { project, hasError, isLoading } = useProjectDetails(projectSlug);

  if (isLoading) {
    return (
      <main className="App project-detail-loading" aria-live="polite">
        <div className="spinner" />
        <p>{t("project.loading")}</p>
      </main>
    );
  }

  if (hasError || !project) {
    return <Navigate to="/projects" replace />;
  }

  const description = getProjectDescription(project, i18n.resolvedLanguage);

  return (
    <main className="App project-detail">
      <Seo
        title={`${project.name} | Portfolio Adrien`}
        description={description}
        path={`/projects/${project.fileName}`}
        image={project.hasImage ? `/og-image/${project.fileName}` : undefined}
      />

      <button
        type="button"
        className="project-back"
        onClick={() => navigate("/projects")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        {t("project.back")}
      </button>

      <ProjectHero project={project} />
      <ProjectLivePreview key={project.fileName} project={project} />
    </main>
  );
};

export default ProjectDetail;
