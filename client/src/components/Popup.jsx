import "./styles/Popup.css";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa";
import Card from "./ui/Card";
import { formatAchievementName } from "../utils/achievements/config";

const Popup = ({ achievement, unlocked }) => {
  const { t } = useTranslation();
  const { name, emoji } = achievement;
  const translationKey = `achievements.items.${formatAchievementName(name)}`;
  const state = unlocked ? "unlocked" : "locked";

  return (
    <Card className={`trophy trophy--${state} m-nolift`}>
      <div className="trophy__icon" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="trophy__name">{t(`${translationKey}.name`)}</h3>
      <p className="trophy__text">
        {unlocked
          ? t(`${translationKey}.description`)
          : `${t("achievements.hint")} : ${t(`${translationKey}.hint`)}`}
      </p>
      <span className="trophy__state">
        {unlocked ? (
          <i className="trophy__dot" aria-hidden="true" />
        ) : (
          <FaLock aria-hidden="true" />
        )}
        {t(unlocked ? "achievements.unlocked" : "achievements.locked")}
      </span>
    </Card>
  );
};

export default Popup;
