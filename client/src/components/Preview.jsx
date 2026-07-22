import "./styles/Preview.css";
import { useNavigate } from "react-router-dom";

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
  const variants = ["1", "2", "3"];

  if (!variants.includes(variant)) return;

  const preview = previews[project.image];

  if (!preview) return null;

  return (
    <article className={`preview-container preview-var${variant}`}>
      <div>
        <h3>{project.name}</h3>
        <br />
        <p>{project.description}</p>
        <br />
        <ul>
          {project.stack &&
            project.stack.map((tech, index) => <li key={index}>{tech}</li>)}
        </ul>
        <br />
        <br />
        <button onClick={() => navigate(`/projects/${project.fileName}`)}>
          En savoir plus
        </button>
      </div>
      <div>
        <video
          src={preview.video}
          poster={preview.poster}
          autoPlay
          loop
          muted
          preload="true"
          disablePictureInPicture
          disableRemotePlayback
          x-webkit-airplay="deny"
          playsInline
          title="https://github.com/siddharthvaddem/openscreen"
        />
      </div>
    </article>
  );
};

export default Preview;
