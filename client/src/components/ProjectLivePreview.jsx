import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/ProjectLivePreview.css";

const ProjectLivePreview = ({ project }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section
      className="project-preview"
      aria-label={t("project.demoLabel", { name: project.name })}
    >
      <div className="project-preview-bar">
        <p>
          <span>adrien@portfolio</span>: ~/projects/
          <strong>{project.fileName}</strong>
        </p>
        <span className="project-preview-status">{t("project.live")}</span>
      </div>

      <div className="project-preview-frame">
        {isLoading && (
          <div className="project-preview-loader">
            <div className="spinner" />
            <p>{t("project.opening")}</p>
          </div>
        )}
        <iframe
          src={`/api/projects/${project.fileName}`}
          title={t("project.iframeTitle", { name: project.name })}
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>
    </section>
  );
};

export default ProjectLivePreview;
