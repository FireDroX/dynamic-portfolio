import "./styles/Project.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import FormattedDescription from "./FormattedDescription";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";

const Project = ({ p }) => {
  const { t, i18n } = useTranslation();
  const projectPath = `/projects/${p.fileName}`;
  const createdAt = new Date(p.createdAt);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? t("projects.unknownDate")
    : new Intl.DateTimeFormat(
        i18n.resolvedLanguage === "en" ? "en-GB" : "fr-FR",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      )
        .format(createdAt)
        .replace(".", "");

  return (
    <article className="project-row">
      <Link
        className="project-row-visual"
        to={projectPath}
        aria-label={t("projects.view", { name: p.name })}
      >
        <img
          src={
            p.hasImage
              ? `/api/projects/${p.fileName}/image`
              : DEFAULT_PROJECT_IMAGE
          }
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
          }}
        />
      </Link>

      <div className="project-row-copy">
        <div className="project-row-meta" aria-label={t("projects.fileInfo")}>
          <time dateTime={p.createdAt}>{formattedDate}</time>
        </div>
        <h2>
          <Link to={projectPath}>{p.name}</Link>
        </h2>
        <p>
          <FormattedDescription>{p.description}</FormattedDescription>
        </p>
      </div>

      <div className="project-row-open">
        <code>{p.fileName}/</code>
        <Link
          to={projectPath}
          aria-label={t("projects.open", { name: p.name })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default Project;
