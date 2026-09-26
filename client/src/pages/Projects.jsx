import "./styles/Projects.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Project from "../components/Project";
import Seo from "../components/Seo";
import getProjectDescription from "../utils/projectDescription";

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeYear, setActiveYear] = useState("all");
  const [search, setSearch] = useState("");

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

  const yearsSet = new Set();
  sortedProjects.forEach((project) => {
    const year = new Date(project.createdAt).getFullYear();
    if (!Number.isNaN(year)) yearsSet.add(year);
  });
  const years = Array.from(yearsSet).sort((a, b) => b - a);

  const yearFilters = [
    { value: "all", label: t("projects.filterAll"), count: sortedProjects.length },
    ...years.map((year) => ({
      value: year,
      label: String(year),
      count: sortedProjects.filter(
        (project) => new Date(project.createdAt).getFullYear() === year,
      ).length,
    })),
  ];

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProjects = sortedProjects.filter((project) => {
    const matchesYear =
      activeYear === "all" ||
      new Date(project.createdAt).getFullYear() === activeYear;
    if (!matchesYear) return false;
    if (!normalizedSearch) return true;

    const description = getProjectDescription(project, i18n.resolvedLanguage);
    return [project.name, project.fileName, description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const isFiltered = activeYear !== "all" || normalizedSearch.length > 0;

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

      {!error && sortedProjects.length > 0 && (
        <div className="projects-toolbar">
          <div
            className="projects-filters"
            role="group"
            aria-label={t("projects.filterByYear")}
          >
            {yearFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={filter.value === activeYear}
                className={filter.value === activeYear ? "is-active" : ""}
                onClick={() => setActiveYear(filter.value)}
              >
                {filter.label}
                <span>{filter.count}</span>
              </button>
            ))}
          </div>

          <label className="projects-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span className="projects-search-label">
              {t("projects.searchLabel")}
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("projects.searchPlaceholder")}
            />
          </label>
        </div>
      )}

      <section
        className="projects-collection"
        aria-label={t("projects.listLabel")}
      >
        <div className="projects-collection-title">
          <div>
            <small>index</small>
            <h2>{t("projects.all")}</h2>
          </div>
          <span>{t("projects.count", { count: filteredProjects.length })}</span>
        </div>

        <div className="projects-list">
          {error ? (
            <p className="projects-message projects-error">
              {t("projects.loadError")}
            </p>
          ) : sortedProjects.length === 0 ? (
            <p className="projects-message">{t("projects.empty")}</p>
          ) : filteredProjects.length === 0 ? (
            <p className="projects-message">
              {isFiltered ? t("projects.noMatches") : t("projects.empty")}
            </p>
          ) : (
            filteredProjects.map((project) => (
              <Project key={project.fileName} p={project} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Projects;
