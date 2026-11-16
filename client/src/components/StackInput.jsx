import { useTranslation } from "react-i18next";
import {
  MAX_STACK,
  TECH_SUGGESTIONS,
  isValidTech,
  normalizeTech,
} from "../utils/techStack";
import TagInput from "./TagInput";
import TechPill from "./TechPill";

// Technology names can contain spaces ("VS Code"): only Enter and comma commit.
const SEPARATORS = /[,\n]+/;
const COMMIT_KEYS = ["Enter", ","];

const StackInput = ({ value, onChange, name }) => {
  const { t } = useTranslation();

  return (
    <TagInput
      value={value}
      onChange={onChange}
      name={name}
      normalize={normalizeTech}
      validate={isValidTech}
      max={MAX_STACK}
      separators={SEPARATORS}
      commitKeys={COMMIT_KEYS}
      suggestions={TECH_SUGGESTIONS}
      label={t("panel.stackLabel")}
      placeholder={t("panel.stackPlaceholder")}
      help={t("panel.stackHelp")}
      invalidMessage={(tech) => t("panel.stackInvalid", { tech })}
      limitMessage={t("panel.stackLimit", { count: MAX_STACK })}
      removeLabel={(tech) => t("panel.removeTech", { tech })}
      renderTag={(tech) => <TechPill name={tech} />}
    />
  );
};

export default StackInput;
