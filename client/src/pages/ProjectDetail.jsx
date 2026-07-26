import "./styles/ProjectDetail.css";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import FormattedDescription from "../components/FormattedDescription";
import Seo from "../components/Seo";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";

const ProjectDetail = () => {
  const { project } = useParams();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadedProject, setLoadedProject] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      setLoading(true);
      setPreviewLoading(true);
      setCurrentProject(null);
      setError(false);

      try {
        const response = await fetch(
          `/api/projects/${encodeURIComponent(project)}/meta`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error(String(response.status));
        setCurrentProject(await response.json());
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoadedProject(project);
          setLoading(false);
        }
      }
    };

    loadProject();
    return () => controller.abort();
  }, [project]);

  useEffect(() => {
    if (currentProject?.fileName !== project) return;

    window.dispatchEvent(
      new CustomEvent("portfolio:project-viewed", {
        detail: { fileName: currentProject.fileName },
      }),
    );
  }, [currentProject, project]);

  if (loading || loadedProject !== project) {
    return (
      <main className="App project-detail-loading" aria-live="polite">
        <div className="spinner" />
        <p>Chargement du projet...</p>
      </main>
    );
  }

  if (error || !currentProject) {
    return <Navigate to="/projects" replace />;
  }

  const hasImage = Boolean(currentProject.hasImage);

  return (
    <main className="App project-detail">
      <Seo
        title={`${currentProject.name} | Portfolio Adrien`}
        description={currentProject.description}
        path={`/projects/${currentProject.fileName}`}
        image={hasImage ? `/og-image/${currentProject.fileName}` : undefined}
      />

      <button
        type="button"
        className="project-back"
        onClick={() => navigate("/projects")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Tous les projets
      </button>

      <section className="project-hero">
        <div className="project-hero-copy">
          <small>Projet interactif</small>
          <h1>{currentProject.name}</h1>
          <p>
            <FormattedDescription>
              {currentProject.description}
            </FormattedDescription>
          </p>
          <a
            className="project-open"
            href={`/api/projects/${project}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir en plein écran
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5M13.5 3H21m0 0v7.5M21 3l-9.75 9.75" />
            </svg>
          </a>
        </div>

        <figure className="project-hero-visual">
          <img
            src={
              hasImage
                ? `/api/projects/${currentProject.fileName}/image`
                : DEFAULT_PROJECT_IMAGE
            }
            alt={`Aperçu de ${currentProject.name}`}
            onError={(event) => {
              event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
            }}
          />
          <figcaption>aperçu / {currentProject.fileName}</figcaption>
        </figure>
      </section>

      <section
        className="project-preview"
        aria-label={`Démo de ${currentProject.name}`}
      >
        <div className="project-preview-bar">
          <p>
            <span>adrien@portfolio</span>: ~/projects/
            <strong>{currentProject.fileName}</strong>
          </p>
          <span className="project-preview-status">Live</span>
        </div>
        <div className="project-preview-frame">
          {previewLoading && (
            <div className="project-preview-loader">
              <div className="spinner" />
              <p>Ouverture de l’expérience...</p>
            </div>
          )}
          <iframe
            src={`/api/projects/${project}`}
            title={`Démo interactive — ${currentProject.name}`}
            onLoad={() => setPreviewLoading(false)}
            allow="fullscreen"
          />
        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;
