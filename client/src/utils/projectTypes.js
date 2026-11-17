export const PROJECT_TYPE_IDS = ["game", "webapp", "tool"];

// i18n key of a project type, or null for a missing/unknown one.
export const getProjectTypeLabelKey = (type) =>
  PROJECT_TYPE_IDS.includes(type) ? `projectTypes.${type}` : null;
