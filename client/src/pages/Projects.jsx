import "./styles/Projects.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Project from "../components/Project";
import Seo from "../components/Seo";

const Projects = () => {
  const { t } = useTranslation();
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
        <p>{t("projects.loading")}</p>
      </main>
    );
  }

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <main className="App projects-page">
      <Seo
        title={t("seo.projectsTitle")}
        description={t("seo.projectsDescription")}
        path="/projects"
      />
      <header className="projects-header">
        <small>portfolio</small>
        <h1>{t("projects.title")}</h1>
        <p>{t("projects.description")}</p>
      </header>

      <section
        className="projects-collection"
        aria-label={t("projects.listLabel")}
      >
        <div className="projects-collection-title">
          <div>
            <small>index</small>
            <h2>{t("projects.all")}</h2>
          </div>
          <span>{t("projects.count", { count: projects.length })}</span>
        </div>

        <div className="projects-list">
          {error ? (
            <p className="projects-message projects-error">
              {t("projects.loadError")}
            </p>
          ) : sortedProjects.length === 0 ? (
            <p className="projects-message">{t("projects.empty")}</p>
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
