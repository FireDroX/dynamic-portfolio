import "../components/styles/Popup.css";
import achievements from "./achievements.json";
import { readArray, writeJson } from "./storage";

new CustomEvent("portfolio");

const STORAGE_KEY = "portfolio_achievements";
const VIEWED_PROJECTS_KEY = "portfolio_viewed_projects";
const VISIT_DAYS_KEY = "portfolio_visit_days";

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

function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

  const today = getLocalDayKey();
  const storedVisitDays = readArray(VISIT_DAYS_KEY).filter(
    (day) => typeof day === "string",
  );
  const hadPreviousVisitDay = storedVisitDays.some((day) => day !== today);
  const visitDays = storedVisitDays.includes(today)
    ? storedVisitDays
    : [...storedVisitDays, today];

  if (visitDays.length !== storedVisitDays.length) {
    writeJson(VISIT_DAYS_KEY, visitDays);
  }
  if (hadPreviousVisitDay) {
    window.dispatchEvent(new CustomEvent("portfolio:back-for-more"));
  }
  if (visitDays.length >= 3) {
    window.dispatchEvent(new CustomEvent("portfolio:regular-visitor"));
  }

  window.addEventListener("portfolio:project-viewed", async (event) => {
    const fileName = event.detail?.fileName;
    if (typeof fileName !== "string" || !fileName.trim()) return;

    const storedProjects = readArray(VIEWED_PROJECTS_KEY).filter(
      (slug) => typeof slug === "string" && slug.trim(),
    );
    const viewedProjects = storedProjects.includes(fileName)
      ? storedProjects
      : [...storedProjects, fileName];

    if (viewedProjects.length !== storedProjects.length) {
      writeJson(VIEWED_PROJECTS_KEY, viewedProjects);
    }
    if (viewedProjects.length >= 3) {
      window.dispatchEvent(new CustomEvent("portfolio:project-hopper"));
    }

    const unlocked = readArray(STORAGE_KEY);
    if (unlocked.includes("the-curator")) return;

    try {
      const response = await fetch("/api/projects", {
        credentials: "include",
      });
      if (!response.ok) return;

      const projects = await response.json();
      const projectSlugs = projects
        .map((project) => project.fileName)
        .filter((slug) => typeof slug === "string" && slug.trim());

      if (
        projectSlugs.length > 0 &&
        projectSlugs.every((slug) => viewedProjects.includes(slug))
      ) {
        window.dispatchEvent(new CustomEvent("portfolio:the-curator"));
      }
    } catch {
      // L'achievement sera vérifié à nouveau à la prochaine visite de projet.
    }
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

    const specialAchievements = new Set(["cheater", "achievement-hunter"]);
    const allAchievements = achievements.filter(
      (achievement) => !specialAchievements.has(formatName(achievement.name)),
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
    localStorage.removeItem(VIEWED_PROJECTS_KEY);
    localStorage.removeItem(VISIT_DAYS_KEY);
    alert("You cheater !\nEverything got deleted");
    window.dispatchEvent(new CustomEvent("portfolio:update"));
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;

    if (typeof event.data?.type === "string") {
      window.dispatchEvent(new CustomEvent(event.data.type));
    }
  });
});
