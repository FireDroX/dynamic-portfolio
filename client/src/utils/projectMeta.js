import featuredProjects from "./featuredProjects";

// fileName -> i18n key of the project type. Intentionally empty: types are content to be supplied by the site owner, not guessed.
// Filling it (DB field, panel input and card display) is tracked in follow-up ticket #79.
export const PROJECT_TYPES = {};

export const getProjectMeta = (fileName) => ({
  type: PROJECT_TYPES[fileName] ?? null,
  stack: featuredProjects.find((project) => project.fileName === fileName)?.stack ?? [],
});
