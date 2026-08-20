import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [commandError, setCommandError] = useState(null);

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

  const normalizedProjectName = projectName.toLocaleLowerCase();
  const suggestedProject = projects.find(({ fileName }) =>
    fileName.toLocaleLowerCase().startsWith(normalizedProjectName),
  );
  const completion = suggestedProject
    ? suggestedProject.fileName.slice(projectName.length)
    : "";
  const commandErrorMessage =
    commandError === null
      ? ""
      : commandError.type === "not-found"
        ? t("home.terminalProjectNotFound", { name: commandError.name })
        : t("home.terminalProjectRequired");

  const acceptSuggestion = () => {
    if (!completion) return;

    setProjectName(suggestedProject.fileName);
    setCursorPosition(suggestedProject.fileName.length);
    setCommandError(null);
  };

  const handleCommandKeyDown = (event) => {
    const isAtEnd =
      event.currentTarget.selectionStart === projectName.length &&
      event.currentTarget.selectionEnd === projectName.length;

    if (
      completion &&
      (event.key === "Tab" || (event.key === "ArrowRight" && isAtEnd))
    ) {
      event.preventDefault();
      acceptSuggestion();
    }
  };

  const handleCommandSubmit = (event) => {
    event.preventDefault();

    const requestedProjectName = projectName.trim();
    if (!requestedProjectName) {
      setCommandError({ type: "required" });
      return;
    }

    const project = projects.find(
      ({ fileName }) =>
        fileName.toLocaleLowerCase() ===
        requestedProjectName.toLocaleLowerCase(),
    );

    if (!project) {
      setCommandError({ type: "not-found", name: requestedProjectName });
      return;
    }

    navigate(`/projects/${encodeURIComponent(project.fileName)}`);
  };

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

        <form
          className="home-terminal-command home-terminal-runner"
          onSubmit={handleCommandSubmit}
        >
          <span aria-hidden="true">$</span>
          <span className="home-terminal-run-prefix" aria-hidden="true">
            run
          </span>
          <label className="home-terminal-sr-only" htmlFor="project-command">
            {t("home.terminalCommandLabel")}
          </label>
          <span className="home-terminal-command-field">
            <span className="home-terminal-prediction" aria-hidden="true">
              {projectName}
              <strong>{completion}</strong>
            </span>
            <input
              id="project-command"
              className="home-terminal-input"
              value={projectName}
              onChange={(event) => {
                setProjectName(event.target.value);
                setCursorPosition(
                  event.target.selectionStart ?? event.target.value.length,
                );
                setCommandError(null);
              }}
              onSelect={(event) => {
                setCursorPosition(
                  event.currentTarget.selectionStart ?? projectName.length,
                );
              }}
              onKeyDown={handleCommandKeyDown}
              disabled={isLoading || hasError}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
              aria-autocomplete="inline"
              aria-describedby="project-command-feedback"
              aria-invalid={Boolean(commandErrorMessage)}
            />
            <i
              className="home-terminal-cursor"
              style={{ "--terminal-cursor-position": cursorPosition }}
              aria-hidden="true"
            />
          </span>
        </form>
        <p
          id="project-command-feedback"
          className={`home-terminal-command-feedback${
            commandErrorMessage ? " home-terminal-command-error" : ""
          }`}
          role={commandErrorMessage ? "alert" : undefined}
        >
          {commandErrorMessage || t("home.terminalCommandHint")}
        </p>
      </div>
    </div>
  );
};

export default HomeProjectTerminal;
