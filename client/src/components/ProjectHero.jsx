import FormattedDescription from "./FormattedDescription";
import DEFAULT_PROJECT_IMAGE from "../utils/defaultProjectImage";
import "./styles/ProjectHero.css";

const ProjectHero = ({ project }) => {
  const hasImage = Boolean(project.hasImage);

  return (
    <section className="project-hero">
      <div className="project-hero-copy">
        <small>Projet interactif</small>
        <h1>{project.name}</h1>
        <p>
          <FormattedDescription>{project.description}</FormattedDescription>
        </p>
        <a
          className="project-open"
          href={`/api/projects/${project.fileName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ouvrir en plein écran
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5M13.5 3H21m0 0v7.5M21 3l-9.75 9.75" />
          </svg>
        </a>
      </div>

      <figure className="project-hero-visual">
        <img
          src={
            hasImage
              ? `/api/projects/${project.fileName}/image`
              : DEFAULT_PROJECT_IMAGE
          }
          alt={`Aperçu de ${project.name}`}
          onError={(event) => {
            event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
          }}
        />
        <figcaption>aperçu / {project.fileName}</figcaption>
      </figure>
    </section>
  );
};

export default ProjectHero;
