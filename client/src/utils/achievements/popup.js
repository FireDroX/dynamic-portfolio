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

  const emoji = document.createElement("div");
  emoji.textContent = achievement.emoji;

  const text = document.createElement("div");
  const label = document.createElement("small");
  label.textContent = i18n.t("achievements.popupLabel");

  const title = document.createElement("h3");
  title.textContent = i18n.t(`${translationKey}.name`);

  const description = document.createElement("p");
  description.textContent = i18n.t(`${translationKey}.description`);

  text.append(label, title, description);
  popup.append(emoji, text);
  getPopupContainer().appendChild(popup);

  setTimeout(() => popup.remove(), 4000);
}
