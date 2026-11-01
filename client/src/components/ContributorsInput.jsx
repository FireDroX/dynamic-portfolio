import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MAX_CONTRIBUTORS,
  githubAvatarUrl,
  isGithubLogin,
  normalizeLogin,
} from "../utils/contributors";
import "./styles/ContributorsInput.css";

const SEPARATORS = /[\s,]+/;

// Tag input for GitHub logins: typing "@FireDroX" then Enter (or space/comma)
// freezes the text into a tag. `name` mirrors the list into a hidden field so
// the value travels with a regular FormData submission.
const ContributorsInput = ({ value, onChange, name }) => {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const addLogins = (text) => {
    const candidates = text.split(SEPARATORS).filter(Boolean);
    if (!candidates.length) return true;

    const next = [...value];
    const seen = new Set(next.map((login) => login.toLowerCase()));
    const invalid = [];

    for (const candidate of candidates) {
      const login = normalizeLogin(candidate);
      if (!isGithubLogin(login)) {
        invalid.push(candidate);
        continue;
      }
      if (seen.has(login.toLowerCase())) continue;
      if (next.length >= MAX_CONTRIBUTORS) {
        setError(t("panel.contributorsLimit", { count: MAX_CONTRIBUTORS }));
        break;
      }
      seen.add(login.toLowerCase());
      next.push(login);
    }

    if (next.length !== value.length) onChange(next);

    if (invalid.length) {
      setDraft(invalid.join(" "));
      setError(t("panel.contributorsInvalid", { login: invalid[0] }));
      return false;
    }

    setDraft("");
    if (next.length < MAX_CONTRIBUTORS) setError("");
    return true;
  };

  const removeLogin = (login) => {
    onChange(value.filter((current) => current !== login));
    setError("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      addLogins(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && value.length) {
      event.preventDefault();
      removeLogin(value[value.length - 1]);
    }
  };

  const handleChange = (event) => {
    const text = event.target.value;
    // Pasted lists ("@a @b, @c") are split right away; the last word stays
    // editable unless it is followed by a separator.
    if (SEPARATORS.test(text)) {
      const parts = text.split(SEPARATORS);
      const rest = parts.pop();
      if (addLogins(parts.join(" "))) setDraft(rest);
      return;
    }

    setDraft(text);
    if (error) setError("");
  };

  return (
    <div className="panel-field contributors-field">
      <label htmlFor={inputId}>{t("panel.contributorsLabel")}</label>
      <div
        className={`contributors-input${error ? " has-error" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) inputRef.current?.focus();
        }}
      >
        {value.map((login) => (
          <span className="contributor-tag" key={login}>
            <img
              src={githubAvatarUrl(login, 40)}
              alt=""
              loading="lazy"
              onError={(event) => {
                // Unknown login: keep the empty circle instead of a broken icon.
                event.currentTarget.style.visibility = "hidden";
              }}
            />
            <span>@{login}</span>
            <button
              type="button"
              onClick={() => removeLogin(login)}
              aria-label={t("panel.removeContributor", { login })}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => addLogins(draft)}
          placeholder={value.length ? "" : t("panel.contributorsPlaceholder")}
          autoComplete="off"
          spellCheck="false"
          aria-invalid={Boolean(error)}
          aria-describedby={`${inputId}-help`}
        />
      </div>
      <small id={`${inputId}-help`} className="contributors-help" role="status">
        {error || t("panel.contributorsHelp")}
      </small>
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}
    </div>
  );
};

export default ContributorsInput;
