import "./styles/Project.css";
import { useTranslation } from "react-i18next";

import Card from "./ui/Card";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";
import { getProjectMeta } from "../utils/projectMeta";

const Project = ({ p }) => {
  const { t, i18n } = useTranslation();
  const { type, stack } = getProjectMeta(p.fileName);
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
    <Card
      to={`/projects/${p.fileName}`}
      className="project-card"
      aria-label={t("projects.view", { name: p.name })}
    >
      <div className="project-card__media m-zoom">
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

      <div className="project-card__body">
        <h3 className="card__title">{p.name}</h3>
        {type && <p className="project-card__type">{t(type)}</p>}
        {stack.length > 0 && (
          <ul className="project-card__stack">
            {stack.map((tech) => (
              <li key={tech} className="projects-pill">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="project-card__foot">
          <span className="projects-badge">{t("projects.playable")}</span>
          <time dateTime={p.createdAt}>{formattedDate}</time>
        </div>
      </div>
    </Card>
  );
};

export default Project;
