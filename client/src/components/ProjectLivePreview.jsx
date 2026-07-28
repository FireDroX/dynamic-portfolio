import { useState } from "react";
import "./styles/ProjectLivePreview.css";

const ProjectLivePreview = ({ project }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section
      className="project-preview"
      aria-label={`Démo de ${project.name}`}
    >
      <div className="project-preview-bar">
        <p>
          <span>adrien@portfolio</span>: ~/projects/
          <strong>{project.fileName}</strong>
        </p>
        <span className="project-preview-status">Live</span>
      </div>

      <div className="project-preview-frame">
        {isLoading && (
          <div className="project-preview-loader">
            <div className="spinner" />
            <p>Ouverture de l’expérience...</p>
          </div>
        )}
        <iframe
          src={`/api/projects/${project.fileName}`}
          title={`Démo interactive — ${project.name}`}
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>
    </section>
  );
};

export default ProjectLivePreview;
