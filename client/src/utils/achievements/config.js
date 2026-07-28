import achievements from "../achievements.json";

export const STORAGE_KEYS = {
  unlocked: "portfolio_achievements",
  explorer: "portfolio_explorer",
  visits: "portfolio_visited",
  viewedProjects: "portfolio_viewed_projects",
  visitDays: "portfolio_visit_days",
};

export const formatAchievementName = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, "-");

export default achievements;
