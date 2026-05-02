import "./styles/Preview.css";
import { useNavigate } from "react-router-dom";

const Preview = ({ project, variant }) => {
  const navigate = useNavigate();
  const variants = ["1", "2", "3"];

  if (!variants.includes(variant)) return;

  const imageSrc = require(`../assets/${project.image}.mp4`);
  const imagePoster = require(`../assets/${project.image}_loader.png`);

  return (
    <article className={"preview-container " + "preview-var" + variant}>
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
          src={imageSrc}
          poster={imagePoster}
          alt={project.name}
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
