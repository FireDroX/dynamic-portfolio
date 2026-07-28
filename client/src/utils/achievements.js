import { initializeAchievements } from "./achievements/init";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAchievements, {
    once: true,
  });
} else {
  initializeAchievements();
}
