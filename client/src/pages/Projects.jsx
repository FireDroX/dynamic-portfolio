import "./styles/Projects.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import Project from "../components/Project";
import Seo from "../components/Seo";
import { getPageItems } from "../utils/pagination";
import { PROJECTS_PAGE_SIZE, fetchProjectsPage } from "../utils/projectsApi";

const SEARCH_DEBOUNCE_MS = 300;

const INITIAL_REQUEST = { key: null, data: null, hasError: false };

const Projects = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the source of truth for page and filters (shareable, back button).
  const page = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);
  const yearParam = Number.parseInt(searchParams.get("year"), 10);
  const activeYear = Number.isInteger(yearParam) ? yearParam : "all";
  const query = searchParams.get("q")?.trim() || "";

  const [search, setSearch] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const [request, setRequest] = useState(INITIAL_REQUEST);
  const searchTimeout = useRef(null);
  const collectionRef = useRef(null);

  // Back/forward navigation changes the query: reflect it in the input.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    if (search.trim() !== query) setSearch(query);
  }

  const requestKey = `${page}|${activeYear}|${query}`;

  useEffect(() => {
    const controller = new AbortController();

    fetchProjectsPage(
      {
        page,
        size: PROJECTS_PAGE_SIZE,
        year: activeYear === "all" ? undefined : activeYear,
        q: query,
      },
      { signal: controller.signal },
    )
      .then((data) => setRequest({ key: requestKey, data, hasError: false }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRequest({ key: requestKey, data: null, hasError: true });
        }
      });

    return () => controller.abort();
  }, [page, activeYear, query, requestKey]);

  useEffect(() => () => clearTimeout(searchTimeout.current), []);

  const updateParams = useCallback(
    (changes, options) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        for (const [key, value] of Object.entries(changes)) {
          if (value === null || value === "") next.delete(key);
          else next.set(key, String(value));
        }
        return next;
      }, options);
    },
    [setSearchParams],
  );

  const { data, hasError } = request;
  const isFetching = request.key !== requestKey;

  // A page past the end (stale link, project unpublished): go to the last one.
  useEffect(() => {
    if (!isFetching && data?.totalPages > 0 && page > data.totalPages) {
      updateParams({ page: data.totalPages }, { replace: true });
    }
  }, [data, isFetching, page, updateParams]);

  if (request.key === null) {
    return (
      <main className="App projects-loading" aria-live="polite">
        <div className="spinner" />
        <p>{t("projects.loading")}</p>
      </main>
    );
  }

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      updateParams({ q: value.trim(), page: null }, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
  };

  const goToPage = (nextPage) => {
    updateParams({ page: nextPage === 1 ? null : nextPage });
    collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const projects = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const years = data?.years ?? [];
  const publishedCount = years.reduce((sum, { count }) => sum + count, 0);

  const yearFilters = [
    { value: "all", label: t("projects.filterAll"), count: publishedCount },
    ...years.map(({ year, count }) => ({
      value: year,
      label: String(year),
      count,
    })),
  ];

  const isFiltered = activeYear !== "all" || query.length > 0;
  const pageSize = data?.size ?? PROJECTS_PAGE_SIZE;
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

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

      {!hasError && publishedCount > 0 && (
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
                onClick={() =>
                  updateParams({
                    year: filter.value === "all" ? null : filter.value,
                    page: null,
                  })
                }
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
              onChange={handleSearchChange}
              placeholder={t("projects.searchPlaceholder")}
            />
          </label>
        </div>
      )}

      <section
        ref={collectionRef}
        className="projects-collection"
        aria-label={t("projects.listLabel")}
      >
        <div className="projects-collection-title">
          <div>
            <small>index</small>
            <h2>{t("projects.all")}</h2>
          </div>
          <span>{t("projects.count", { count: total })}</span>
        </div>

        <div
          className={`projects-list${isFetching ? " is-fetching" : ""}`}
          aria-busy={isFetching}
        >
          {hasError ? (
            <p className="projects-message projects-error">
              {t("projects.loadError")}
            </p>
          ) : projects.length === 0 ? (
            <p className="projects-message">
              {isFiltered ? t("projects.noMatches") : t("projects.empty")}
            </p>
          ) : (
            projects.map((project) => (
              <Project key={project.fileName} p={project} />
            ))
          )}
        </div>

        {!hasError && totalPages > 1 && (
          <nav
            className="projects-pagination"
            aria-label={t("projects.pagination")}
          >
            <p>
              {t("projects.range", {
                from: rangeStart,
                to: rangeEnd,
                total,
              })}
            </p>
            <div className="projects-pages">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                aria-label={t("projects.previousPage")}
              >
                ←
              </button>
              {getPageItems(page, totalPages).map((item) =>
                typeof item === "string" ? (
                  <span key={item} aria-hidden="true">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={item === page ? "is-active" : ""}
                    aria-current={item === page ? "page" : undefined}
                    aria-label={t("projects.goToPage", { page: item })}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                aria-label={t("projects.nextPage")}
              >
                →
              </button>
            </div>
          </nav>
        )}
      </section>
    </main>
  );
};

export default Projects;
