import "../../components/styles/Popup.css";

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
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.setAttribute("role", "status");

  const emoji = document.createElement("div");
  emoji.textContent = achievement.emoji;

  const text = document.createElement("div");
  const label = document.createElement("small");
  label.textContent = "🥚 Easter Egg trouvé !";

  const title = document.createElement("h3");
  title.textContent = achievement.name;

  const description = document.createElement("p");
  description.textContent = achievement.description;

  text.append(label, title, description);
  popup.append(emoji, text);
  getPopupContainer().appendChild(popup);

  setTimeout(() => popup.remove(), 4000);
}
