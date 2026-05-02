import "../components/styles/Popup.css";
import achievements from "./achievements.json";

new CustomEvent("portfolio");

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
        window.dispatchEvent(new CustomEvent("portfolio:update"));

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

  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");

  switch (source) {
    case "linkedin":
      window.dispatchEvent(new CustomEvent("portfolio:recruiter"));
      break;
    case "github":
      window.dispatchEvent(new CustomEvent("portfolio:nerd"));
      break;

    default:
      break;
  }

  let typed = "";
  const target = "adrien";

  window.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();

    typed += key;

    if (!target.startsWith(typed)) {
      typed = "";
      return;
    }

    if (typed === target) {
      window.dispatchEvent(new CustomEvent("portfolio:thats-me"));
      typed = "";
    }
  });

  window.addEventListener("portfolio:update", () => {
    const allAchievements = [...achievements];
    allAchievements.pop(); // Remove the last achievement (achievement hunter)

    const hasAllAchievements = allAchievements.every((a) => {
      const name = a.name.toLowerCase().trim().replace(" ", "-");
      return JSON.parse(
        localStorage.getItem("portfolio_achievements") || "[]",
      )?.includes(name);
    });

    if (hasAllAchievements)
      window.dispatchEvent(new CustomEvent("portfolio:achievement-hunter"));
  });
});
