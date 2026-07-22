import "./styles/Projects.css";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import FormattedDescription from "../components/FormattedDescription";
import Project from "../components/Project";
import Seo from "../components/Seo";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";

const Projects = () => {
  const { project } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadedRoute, setLoadedRoute] = useState(null);
  const routeKey = project || "projects-list";

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      setPreviewLoading(true);
      try {
        const endpoint = project
          ? `/api/projects/${encodeURIComponent(project)}/meta`
          : "/api/projects";
        const res = await fetch(endpoint, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (project) setCurrentProject(data);
        else setProjects(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoadedRoute(routeKey);
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => controller.abort();
  }, [project, routeKey]);

  if (loading || loadedRoute !== routeKey) {
    return (
      <main className="App projects-loading" aria-live="polite">
        <div className="spinner" />
        <p>Chargement des projets...</p>
      </main>
    );
  }

  if (project) {
    if (error || !currentProject) return <Navigate to="/projects" replace />;

    const hasImage = Boolean(currentProject.hasImage);

    return (
      <main className="App project-detail">
        <Seo
          title={`${currentProject.name} | Portfolio Adrien`}
          description={currentProject.description}
          path={`/projects/${currentProject.fileName}`}
          image={hasImage ? `/og-image/${currentProject.fileName}` : undefined}
        />
        <button className="project-back" onClick={() => navigate("/projects")}>
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
              <FormattedDescription>{currentProject.description}</FormattedDescription>
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

        <section className="project-preview" aria-label={`Démo de ${currentProject.name}`}>
          <div className="project-preview-bar">
            <p>{currentProject.name}</p>
            <span className="project-preview-status">Live</span>
          </div>
          <div className="project-preview-frame">
            {previewLoading && (
              <div className="project-preview-loader">
                <div className="spinner" />
                <p>Ouverture de l'expérience...</p>
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
  }

  return (
    <div className="App">
      <Seo
        title="Projets web interactifs | Portfolio Adrien"
        description="Découvrez les projets web d’Adrien : applications React, expériences interactives et créations full-stack testables en ligne."
        path="/projects"
      />
      <header>
        <small>portfolio</small>
        <h1>Projects</h1>
        <p>
          Liste des <strong>projets</strong> créés.
        </p>
      </header>
      <section className="projects-grid">
        {error ? (
          <p className="projects-error">Impossible de charger les projets pour le moment.</p>
        ) : projects.length === 0 ? (
          <Project
            p={{
              name: "No projects !",
              description: "(juste un template vide)",
            }}
          />
        ) : (
          projects
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((p) => <Project key={p.fileName} p={p} />)
        )}
      </section>
    </div>
  );
};

export default Projects;
