import "./styles/Preview.css";
import { useNavigate } from "react-router";

import preview1 from "../assets/preview1.mp4";
import preview1Poster from "../assets/preview1_loader.png";
import preview2 from "../assets/preview2.mp4";
import preview2Poster from "../assets/preview2_loader.png";
import preview3 from "../assets/preview3.mp4";
import preview3Poster from "../assets/preview3_loader.png";

const previews = {
  preview1: { video: preview1, poster: preview1Poster },
  preview2: { video: preview2, poster: preview2Poster },
  preview3: { video: preview3, poster: preview3Poster },
};

const Preview = ({ project, variant }) => {
  const navigate = useNavigate();
  const preview = previews[project.image];
  if (!preview || !["1", "2", "3"].includes(variant)) return null;

  return (
    <article className={`preview-container preview-var${variant}`}>
      <div className="preview-copy">
        <div className="preview-meta">
          <span>Projet sélectionné</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="preview-stack" aria-label="Technologies utilisées">
          {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
        </ul>
        <button
          type="button"
          onClick={() => navigate(`/projects/${project.fileName}`)}
          aria-label={`Découvrir le projet ${project.name}`}
        >
          Découvrir le projet
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="preview-media">
        <video
          src={preview.video}
          poster={preview.poster}
          autoPlay
          loop
          muted
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          x-webkit-airplay="deny"
          playsInline
          title={`Aperçu vidéo du projet ${project.name}`}
        />
        <span className="preview-media-label">Aperçu en direct</span>
      </div>
    </article>
  );
};

export default Preview;
