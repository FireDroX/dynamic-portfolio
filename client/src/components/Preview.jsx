import "./styles/Preview.css";
import { useTranslation } from "react-i18next";
import Card from "./ui/Card";
import { TechStack } from "./TechPill";

import preview1 from "../assets/preview1.webp";
import preview4 from "../assets/preview4.webp";
import homelab from "../assets/homelab.webp";

const thumbnails = { preview1, preview4, homelab };

const Preview = ({ project }) => {
  const { t } = useTranslation();
  const thumbnail = thumbnails[project.image];

  return (
    <Card
      to={`/projects/${encodeURIComponent(project.fileName)}`}
      className="preview"
    >
      {thumbnail && (
        <div className="panel panel--top">
          <img
            className="frame__img"
            src={thumbnail}
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            alt=""
          />
        </div>
      )}
      <h3>{project.name}</h3>
      <p>{t(project.descriptionKey)}</p>
      <TechStack
        stack={project.stack}
        label={t("preview.technologies")}
        className="preview__stack"
      />
      <span className="preview__badge">
        <i aria-hidden="true" />
        {t("preview.playable")}
      </span>
    </Card>
  );
};

export default Preview;
