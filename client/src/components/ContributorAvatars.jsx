import { useState } from "react";
import { useTranslation } from "react-i18next";
import { githubAvatarUrl, githubProfileUrl } from "../utils/contributors";
import "./styles/ContributorAvatars.css";

// GitHub-style stack of overlapping avatars: the first contributor sits on
// top, the next ones slide underneath towards the right.
const ContributorAvatars = ({ contributors, align = "end", className = "" }) => {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(() => new Set());

  if (!contributors?.length) return null;

  return (
    <ul
      className={`contributor-avatars contributor-avatars--${align} ${className}`.trim()}
      aria-label={t("contributors.label")}
    >
      {contributors.map((login, index) => (
        <li key={login} style={{ zIndex: contributors.length - index }}>
          <a
            href={githubProfileUrl(login)}
            target="_blank"
            rel="noopener noreferrer"
            title={`@${login}`}
            aria-label={t("contributors.profile", { login })}
          >
            {failed.has(login) ? (
              <span aria-hidden="true">{login[0].toUpperCase()}</span>
            ) : (
              <img
                src={githubAvatarUrl(login)}
                alt=""
                loading="lazy"
                width="64"
                height="64"
                onError={() =>
                  setFailed((previous) => new Set(previous).add(login))
                }
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ContributorAvatars;
