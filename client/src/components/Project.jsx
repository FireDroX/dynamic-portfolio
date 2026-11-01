import "./styles/Project.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import ContributorAvatars from "./ContributorAvatars";
import FormattedDescription from "./FormattedDescription";
import { getContributors } from "../utils/contributors";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";
import getProjectDescription from "../utils/projectDescription";

const Project = ({ p }) => {
  const { t, i18n } = useTranslation();
  const projectPath = `/projects/${p.fileName}`;
  const description = getProjectDescription(p, i18n.resolvedLanguage);
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

  // The title link is stretched over the whole row (see Project.css), so the
  // entire card opens the project; contributor avatars sit above that layer.
  return (
    <article className="project-row">
      <div className="project-row-visual">
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
      </div>

      <div className="project-row-body">
        <div className="project-row-head">
          <h2>
            <Link className="project-row-link" to={projectPath}>
              {p.name}
            </Link>
          </h2>
          <span className="project-row-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <p className="project-row-description">
          <FormattedDescription>{description}</FormattedDescription>
        </p>

        <div className="project-row-foot">
          <div className="project-row-meta" aria-label={t("projects.fileInfo")}>
            <time dateTime={p.createdAt}>{formattedDate}</time>
            <code>{p.fileName}/</code>
          </div>
          <ContributorAvatars
            contributors={getContributors(p)}
            className="project-row-contributors"
          />
        </div>
      </div>
    </article>
  );
};

export default Project;
