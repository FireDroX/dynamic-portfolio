import "./styles/Project.css";
import { useTranslation } from "react-i18next";

import Card from "./ui/Card";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";
import { getProjectTypeLabelKey } from "../utils/projectTypes";
import { getStack } from "../utils/techStack";
import { TechStack } from "./TechPill";

const Project = ({ p }) => {
  const { t, i18n } = useTranslation();
  const typeKey = getProjectTypeLabelKey(p.type);
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
        <TechStack stack={getStack(p)} label={t("stack.label")} />
        <div className="project-card__foot">
          <span className="projects-badge">{t("projects.playable")}</span>
          <span className="project-card__meta">
            {typeKey && (
              <>
                <span className="project-card__type">{t(typeKey)}</span>
                <span aria-hidden="true"> · </span>
              </>
            )}
            <time dateTime={p.createdAt}>{formattedDate}</time>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Project;
