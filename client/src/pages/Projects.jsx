import "./styles/Projects.css";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Project from "../components/Project";

const Projects = () => {
  const { project } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/projects", { credentials: "include" });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [project]);

  if (loading) {
    return (
      <main className="App projects-loading" aria-live="polite">
        <div className="spinner" />
        <p>Chargement des projets...</p>
      </main>
    );
  }

  if (project) {
    const currentProject = projects.find((p) => p.fileName === project);

    if (!currentProject) return <Navigate to="/projects" replace />;

    const formattedDescription = currentProject.description?.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    const hasImage = currentProject.image?.length > 37;

    return (
      <main className="App project-detail">
        <button className="project-back" onClick={() => navigate("/projects")}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Tous les projets
        </button>

        <section className={`project-hero ${hasImage ? "" : "project-hero--no-image"}`}>
          <div className="project-hero-copy">
            <small>Projet interactif</small>
            <h1>{currentProject.name}</h1>
            <p dangerouslySetInnerHTML={{ __html: formattedDescription }} />
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

          {hasImage && (
            <figure className="project-hero-visual">
              <img src={currentProject.image} alt={`Aperçu de ${currentProject.name}`} />
              <figcaption>aperçu / {currentProject.fileName}</figcaption>
            </figure>
          )}
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
      <header>
        <small>portfolio</small>
        <h1>Projects</h1>
        <p>
          Liste des <strong>projets</strong> créés.
        </p>
      </header>
      <section className="projects-grid">
        {projects.length === 0 ? (
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
