import "./styles/Project.css";
import { useNavigate } from "react-router-dom";

import FormattedDescription from "./FormattedDescription";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";

const Project = ({ p }) => {
  const navigate = useNavigate();

  return (
    <article className="project-article">
      <img
        src={
          p.hasImage
            ? `/api/projects/${p.fileName}/image`
            : DEFAULT_PROJECT_IMAGE
        }
        alt={`Aperçu de ${p.name}`}
        className="project-image"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
        }}
      />
      <button
        type="button"
        className="project-icon"
        onClick={() => navigate(`/projects/${p.fileName}`)}
        aria-label={`Voir le projet ${p.name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </button>
      <h3>{p.name}</h3>
      <p>
        <FormattedDescription>{p.description}</FormattedDescription>
      </p>
    </article>
  );
};

export default Project;
