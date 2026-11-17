import { useEffect, useState } from "react";
import { getTechIcon } from "../utils/techStack";
import { fetchTechIcon, getIconColor } from "../utils/techIconApi";
import "./styles/TechPill.css";

// Logo of a technology outside the catalog, fetched once from the server.
const useRemoteIcon = (name, enabled) => {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    fetchTechIcon(name).then((icon) => {
      if (active) setRemote(icon ? { name, icon } : null);
    });
    return () => {
      active = false;
    };
  }, [name, enabled]);

  // Ignore a result fetched for a previous name.
  return remote?.name === name ? remote.icon : null;
};

const TechPill = ({ name }) => {
  const icon = getTechIcon(name);
  const remote = useRemoteIcon(name, !icon);

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
      {!icon && remote && (
        <svg
          className="tech-pill__icon"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: getIconColor(remote.hex) }}
          aria-hidden="true"
        >
          <path d={remote.path} />
        </svg>
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
