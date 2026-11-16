import "../../components/styles/Popup.css";
import i18n from "../../i18n";
import { formatAchievementName } from "./config";

function getPopupContainer() {
  let container = document.getElementById("achievement-popup-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "achievement-popup-container";
    document.body.appendChild(container);
  }

  return container;
}

export function showAchievementPopup(achievement) {
  const translationKey = `achievements.items.${formatAchievementName(achievement.name)}`;
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.setAttribute("role", "status");

  const icon = document.createElement("div");
  icon.className = "achievement-popup__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = achievement.emoji;

  const body = document.createElement("div");
  body.className = "achievement-popup__body";

  const label = document.createElement("small");
  label.className = "achievement-popup__label";
  label.textContent = i18n.t("achievements.popupLabel");

  const title = document.createElement("strong");
  title.className = "achievement-popup__name";
  title.textContent = i18n.t(`${translationKey}.name`);

  const description = document.createElement("span");
  description.className = "achievement-popup__desc";
  description.textContent = i18n.t(`${translationKey}.description`);

  body.append(label, title, description);
  popup.append(icon, body);
  getPopupContainer().appendChild(popup);

  setTimeout(() => popup.remove(), 4000);
}
