import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import "./styles/HomeProjectTerminal.css";

const formatProjectDate = (value, locale, unknownDate) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unknownDate;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
};

const HomeProjectTerminal = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const data = await response.json();
        setProjects(
          [...data].sort((first, second) =>
            first.fileName.localeCompare(second.fileName),
          ),
        );
      } catch (error) {
        if (error.name !== "AbortError") setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadProjects();
    return () => controller.abort();
  }, []);

  return (
    <div className="home-terminal" aria-label={t("home.terminalLabel")}>
      <div className="home-terminal-title">adrien@portfolio: ~/projects</div>
      <div className="home-terminal-content">
        <p className="home-terminal-command">
          <span>$</span> ls -lah
        </p>

        {isLoading ? (
          <p className="home-terminal-message">{t("home.terminalReading")}</p>
        ) : hasError ? (
          <p className="home-terminal-message home-terminal-error">
            {t("home.terminalError")}
          </p>
        ) : (
          <div className="home-terminal-list">
            <p className="home-terminal-total">
              {t("home.terminalTotal", { count: projects.length })}
            </p>
            {projects.map((project) => (
              <Link
                className="home-terminal-row"
                to={`/projects/${project.fileName}`}
                key={project.fileName}
                aria-label={t("home.terminalOpenProject", {
                  name: project.name,
                })}
              >
                <span>drwxr-xr-x</span>
                <span>1</span>
                <span>adrien</span>
                <span>4.0K</span>
                <time dateTime={project.createdAt}>
                  {formatProjectDate(
                    project.createdAt,
                    i18n.resolvedLanguage === "en" ? "en-GB" : "fr-FR",
                    t("home.terminalUnknownDate"),
                  )}
                </time>
                <strong>{project.fileName}/</strong>
              </Link>
            ))}
          </div>
        )}

        <p className="home-terminal-command">
          <span>$</span> <i aria-hidden="true" />
        </p>
      </div>
    </div>
  );
};

export default HomeProjectTerminal;
