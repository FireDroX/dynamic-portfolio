import { getTechIcon } from "../utils/techStack";
import "./styles/TechPill.css";

const TechPill = ({ name }) => {
  const icon = getTechIcon(name);

  return (
    <span className="tech-pill">
      {icon && (
        <icon.Icon
          className="tech-pill__icon"
          size={16}
          color={icon.color}
          aria-hidden="true"
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
