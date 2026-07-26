import "./styles/Projects.css";
import { useEffect, useState } from "react";

import Project from "../components/Project";
import Seo from "../components/Seo";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch("/api/projects", {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(String(response.status));
        setProjects(await response.json());
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProjects();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <main className="App projects-loading" aria-live="polite">
        <div className="spinner" />
        <p>Chargement des projets...</p>
      </main>
    );
  }

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <main className="App projects-page">
      <Seo
        title="Projets web interactifs | Portfolio Adrien"
        description="Découvrez les projets web d’Adrien : applications React, expériences interactives et créations full-stack testables en ligne."
        path="/projects"
      />
      <header className="projects-header">
        <small>portfolio</small>
        <h1>Projects</h1>
        <p>
          Applications, jeux et expériences interactives. Chaque projet peut
          être ouvert et testé directement depuis le portfolio.
        </p>
      </header>

      <section className="projects-collection" aria-label="Liste des projets">
        <div className="projects-collection-title">
          <div>
            <small>index</small>
            <h2>Tous les projets</h2>
          </div>
          <span>
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="projects-list">
          {error ? (
            <p className="projects-message projects-error">
              Impossible de charger les projets pour le moment.
            </p>
          ) : sortedProjects.length === 0 ? (
            <p className="projects-message">Aucun projet disponible.</p>
          ) : (
            sortedProjects.map((project) => (
              <Project key={project.fileName} p={project} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Projects;
