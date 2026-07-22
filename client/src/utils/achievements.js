import "../components/styles/Popup.css";
import achievements from "./achievements.json";
import { readArray, writeJson } from "./storage";

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

    window.addEventListener(`portfolio:${name}`, () => {
      const container = getContainer();

      const userAchievements = readArray(STORAGE_KEY);

      if (!userAchievements.includes(name)) {
        userAchievements.push(name);
        writeJson(STORAGE_KEY, userAchievements);
        window.dispatchEvent(new CustomEvent("portfolio:update"));

        const popup = document.createElement("div");
        popup.className = "achievement-popup";
        popup.setAttribute("role", "status");

        const emoji = document.createElement("div");
        emoji.textContent = a.emoji;
        const text = document.createElement("div");
        const label = document.createElement("small");
        label.textContent = "🥚 Easter Egg trouvé !";
        const title = document.createElement("h3");
        title.textContent = a.name;
        const description = document.createElement("p");
        description.textContent = a.description;
        text.append(label, title, description);
        popup.append(emoji, text);

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
  const targets = [
    "adrien",
    "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba",
  ];

  window.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();

    typed += key;

    if (!targets.some((t) => t.startsWith(typed))) {
      typed = "";
      return;
    }

    if (typed === targets[0]) {
      window.dispatchEvent(new CustomEvent("portfolio:thats-me"));
      typed = "";
    }
    if (typed === targets[1]) {
      window.dispatchEvent(new CustomEvent("portfolio:konami-code"));
      typed = "";
    }
  });

  window.addEventListener("portfolio:update", () => {
    const stored = readArray(STORAGE_KEY);

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
      writeJson(STORAGE_KEY, updated);
    }
  });
  window.dispatchEvent(new CustomEvent("portfolio:update"));

  window.addEventListener("portfolio:cheater", () => {
    writeJson(STORAGE_KEY, ["cheater"]);
    localStorage.removeItem("portfolio_explorer");
    localStorage.removeItem("portfolio_visited");
    alert("You cheater !\nEverything got deleted");
    window.dispatchEvent(new CustomEvent("portfolio:update"));
  });

  window.addEventListener("message", (event) => {
    if (
      !["https://portfolio.addrien.fr", "http://localhost:3000"].includes(
        event.origin,
      )
    )
      return;

    if (typeof event.data?.type === "string") {
      window.dispatchEvent(new CustomEvent(event.data.type));
    }
  });
});
