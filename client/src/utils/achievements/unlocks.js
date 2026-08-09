import { readArray, writeJson } from "../storage";
import achievements, { formatAchievementName, STORAGE_KEYS } from "./config";
import { showAchievementPopup } from "./popup";
import i18n from "../../i18n";

const SPECIAL_ACHIEVEMENTS = new Set(["cheater", "achievement-hunter"]);

export function registerAchievementUnlocks() {
  achievements.forEach((achievement) => {
    const achievementName = formatAchievementName(achievement.name);

    window.addEventListener(`portfolio:${achievementName}`, () => {
      const unlockedAchievements = readArray(STORAGE_KEYS.unlocked);
      if (unlockedAchievements.includes(achievementName)) return;

      unlockedAchievements.push(achievementName);
      writeJson(STORAGE_KEYS.unlocked, unlockedAchievements);
      window.dispatchEvent(new CustomEvent("portfolio:update"));
      showAchievementPopup(achievement);
    });
  });
}

export function registerCompletionTracker() {
  window.addEventListener("portfolio:update", () => {
    const unlockedAchievements = readArray(STORAGE_KEYS.unlocked);
    const requiredAchievements = achievements
      .map((achievement) => formatAchievementName(achievement.name))
      .filter((name) => !SPECIAL_ACHIEVEMENTS.has(name));

    const hasCompletedCollection = requiredAchievements.every((name) =>
      unlockedAchievements.includes(name),
    );
    const hasHunterAchievement =
      unlockedAchievements.includes("achievement-hunter");

    if (hasCompletedCollection && !hasHunterAchievement) {
      window.dispatchEvent(new CustomEvent("portfolio:achievement-hunter"));
    }

    if (!hasCompletedCollection && hasHunterAchievement) {
      writeJson(
        STORAGE_KEYS.unlocked,
        unlockedAchievements.filter((name) => name !== "achievement-hunter"),
      );
    }
  });

  window.dispatchEvent(new CustomEvent("portfolio:update"));
}

export function registerCheaterAchievement() {
  window.addEventListener("portfolio:cheater", () => {
    writeJson(STORAGE_KEYS.unlocked, ["cheater"]);
    localStorage.removeItem(STORAGE_KEYS.explorer);
    localStorage.removeItem(STORAGE_KEYS.visits);
    localStorage.removeItem(STORAGE_KEYS.viewedProjects);
    localStorage.removeItem(STORAGE_KEYS.visitDays);
    alert(i18n.t("achievements.cheaterAlert"));
    window.dispatchEvent(new CustomEvent("portfolio:update"));
  });
}
