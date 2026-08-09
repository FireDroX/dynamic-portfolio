import "./styles/Popup.css";
import { useTranslation } from "react-i18next";
import { formatAchievementName } from "../utils/achievements/config";

const Popup = ({ achievement, unlocked }) => {
  const { t } = useTranslation();
  const { name, emoji } = achievement;
  const translationKey = `achievements.items.${formatAchievementName(name)}`;

  return (
    <article className={`achievement ${unlocked ? "unlocked" : "locked"}`}>
      <div className="achievement-card-top">
        <div className="achievement-icon" aria-hidden="true">
          {unlocked ? emoji : "?"}
        </div>
        <span className="achievement-state">
          <i aria-hidden="true" />
          {t(unlocked ? "achievements.unlocked" : "achievements.locked")}
        </span>
      </div>

      <div className="achievement-content">
        <small>
          {t(unlocked ? "achievements.achievement" : "achievements.hint")}
        </small>
        <h3>
          {unlocked ? t(`${translationKey}.name`) : t("achievements.unknown")}
        </h3>
        <p>{t(`${translationKey}.${unlocked ? "description" : "hint"}`)}</p>
      </div>
    </article>
  );
};

export default Popup;
