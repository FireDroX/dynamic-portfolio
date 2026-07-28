import { readArray, writeJson } from "../storage";
import { STORAGE_KEYS } from "./config";

async function getProjectSlugs() {
  const response = await fetch("/api/projects", {
    credentials: "include",
  });
  if (!response.ok) return [];

  const projects = await response.json();
  return projects
    .map((project) => project.fileName)
    .filter((slug) => typeof slug === "string" && slug.trim());
}

async function handleProjectViewed(event) {
  const fileName = event.detail?.fileName;
  if (typeof fileName !== "string" || !fileName.trim()) return;

  const storedProjects = readArray(STORAGE_KEYS.viewedProjects).filter(
    (slug) => typeof slug === "string" && slug.trim(),
  );
  const viewedProjects = storedProjects.includes(fileName)
    ? storedProjects
    : [...storedProjects, fileName];

  if (viewedProjects.length !== storedProjects.length) {
    writeJson(STORAGE_KEYS.viewedProjects, viewedProjects);
  }
  if (viewedProjects.length >= 3) {
    window.dispatchEvent(new CustomEvent("portfolio:project-hopper"));
  }

  const unlockedAchievements = readArray(STORAGE_KEYS.unlocked);
  if (unlockedAchievements.includes("the-curator")) return;

  try {
    const projectSlugs = await getProjectSlugs();
    if (
      projectSlugs.length > 0 &&
      projectSlugs.every((slug) => viewedProjects.includes(slug))
    ) {
      window.dispatchEvent(new CustomEvent("portfolio:the-curator"));
    }
  } catch {
    // The achievement will be checked again on the next project visit.
  }
}

export function registerProjectTracker() {
  window.addEventListener("portfolio:project-viewed", handleProjectViewed);
}
