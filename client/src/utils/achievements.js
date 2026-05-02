import "../components/styles/Popup.css";
import achievements from "./achievements.json";

new CustomEvent("portfolio");

const STORAGE_KEY = "portfolio_achievements";

function formatName(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

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
    const name = formatName(a.name);

    window.addEventListener(`portfolio:${name}`, (e) => {
      const container = getContainer();

      const userAchievements = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      );

      if (!userAchievements.includes(name)) {
        userAchievements.push(name);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userAchievements));
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
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const allAchievements = achievements.filter(
      (a) => formatName(a.name) !== "achievement-hunter",
    );

    const requiredNames = allAchievements.map((a) => formatName(a.name));

    const hasAllAchievements = requiredNames.every((name) =>
      stored.includes(name),
    );

    const hunterKey = "achievement-hunter";
    const hasHunter = stored.includes(hunterKey);

    if (hasAllAchievements && !hasHunter) {
      window.dispatchEvent(new CustomEvent("portfolio:achievement-hunter"));
    }

    if (!hasAllAchievements && hasHunter) {
      const updated = stored.filter((a) => a !== hunterKey);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  });
  window.dispatchEvent(new CustomEvent("portfolio:update"));
});
