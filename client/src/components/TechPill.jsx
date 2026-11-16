import { getTechIcon } from "../utils/techStack";
import "./styles/TechPill.css";

const TechPill = ({ name }) => {
  const icon = getTechIcon(name);

  return (
    <span className="tech-pill">
      {icon && (
        <img
          className={`ic ic-16 ${icon.className}`.trim()}
          src={icon.src}
          alt=""
          width="16"
          height="16"
          loading="lazy"
        />
      )}
      {name}
    </span>
  );
};

export const TechStack = ({ stack, label, className = "" }) => {
  if (!stack?.length) return null;

  return (
    <ul className={`tech-stack ${className}`.trim()} aria-label={label}>
      {stack.map((name) => (
        <li key={name}>
          <TechPill name={name} />
        </li>
      ))}
    </ul>
  );
};

export default TechPill;
