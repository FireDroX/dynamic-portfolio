import featuredProjects from "./featuredProjects";

// fileName -> i18n key of the project type. À remplir par Adrien, ne pas inventer.
export const PROJECT_TYPES = {};

export const getProjectMeta = (fileName) => ({
  type: PROJECT_TYPES[fileName] ?? null,
  stack: featuredProjects.find((project) => project.fileName === fileName)?.stack ?? [],
});
