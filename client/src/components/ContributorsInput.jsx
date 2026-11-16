import { useTranslation } from "react-i18next";
import {
  MAX_CONTRIBUTORS,
  githubAvatarUrl,
  isGithubLogin,
  normalizeLogin,
} from "../utils/contributors";
import TagInput from "./TagInput";

const SEPARATORS = /[\s,]+/;
const COMMIT_KEYS = ["Enter", ",", " "];

// Tag input for GitHub logins: typing "@FireDroX" then Enter (or space/comma)
// freezes the text into a tag.
const ContributorsInput = ({ value, onChange, name }) => {
  const { t } = useTranslation();

  return (
    <TagInput
      value={value}
      onChange={onChange}
      name={name}
      normalize={normalizeLogin}
      validate={isGithubLogin}
      max={MAX_CONTRIBUTORS}
      separators={SEPARATORS}
      commitKeys={COMMIT_KEYS}
      label={t("panel.contributorsLabel")}
      placeholder={t("panel.contributorsPlaceholder")}
      help={t("panel.contributorsHelp")}
      invalidMessage={(login) => t("panel.contributorsInvalid", { login })}
      limitMessage={t("panel.contributorsLimit", { count: MAX_CONTRIBUTORS })}
      removeLabel={(login) => t("panel.removeContributor", { login })}
      renderTag={(login) => (
        <>
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
        </>
      )}
    />
  );
};

export default ContributorsInput;
