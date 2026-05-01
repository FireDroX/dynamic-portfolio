import "../components/styles/Popup.css";
import achievements from "./achievements_list.json";

new Event("portfolio");

function getContainer() {
  let el = document.getElementById("achievement-popup-container");

  if (!el) {
    el = document.createElement("div");
    el.id = "achievement-popup-container";
    document.body.appendChild(el);
  }

  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  achievements.forEach((a) => {
    const name = a.name.toLowerCase().trim().replace(" ", "-");

    window.addEventListener(`portfolio:${name}`, (e) => {
      const container = getContainer();

      const userAchievements = JSON.parse(
        localStorage.getItem("portfolio_achievements") || "[]",
      );

      if (!userAchievements.includes(name)) {
        userAchievements.push(name);
        localStorage.setItem(
          "portfolio_achievements",
          JSON.stringify(userAchievements),
        );

        const popup = document.createElement("div");
        popup.className = "achievement-popup";
        popup.innerHTML = `
        <div>${a.emoji}</div>
        <div>
          <small>🥚 Easter Egg trouvé !</small>
          <h3>${a.name}</h3>
          <p>${a.description}</p>
        </div>
      `;

        container.appendChild(popup);

        setTimeout(() => {
          popup.remove();
        }, 4000);
      }
    });
  });

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    window.dispatchEvent(new CustomEvent("portfolio:burning-eyes"));
  }
});
