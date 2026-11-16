// Single source of truth linking a technology name to its design-system icon
// (client/public/assets/icons). `extra` carries the icon-kit modifier classes.
export const MAX_STACK = 12;
export const MAX_TECH_LENGTH = 30;

const TECH_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .+#/&_-]*$/u;

// Mirrors utils/stack.js on the server.
export const normalizeTech = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

export const isValidTech = (value) => {
  const tech = normalizeTech(value);
  return (
    tech.length > 0 && tech.length <= MAX_TECH_LENGTH && TECH_PATTERN.test(tech)
  );
};

export const TECH_CATALOG = [
  { name: "React", icon: "react" },
  { name: "JavaScript", icon: "javascript", aliases: ["js"] },
  { name: "TypeScript", icon: "typescript", aliases: ["ts"] },
  { name: "HTML", icon: "html-5", extra: "ic-tall", aliases: ["html5"] },
  { name: "CSS", icon: "css", aliases: ["css3"] },
  {
    name: "Tailwind CSS",
    icon: "tailwindcss",
    extra: "ic-land",
    aliases: ["tailwind"],
  },
  { name: "Node.js", icon: "nodejs", aliases: ["node"] },
  {
    name: "Express",
    icon: "si-express",
    extra: "ic-land ic-ink",
    aliases: ["express.js"],
  },
  { name: "NestJS", icon: "nestjs", aliases: ["nest"] },
  { name: "PHP", icon: "php", extra: "ic-wide" },
  { name: "MySQL", icon: "si-mysql", extra: "ic-land" },
  { name: "PostgreSQL", icon: "postgres", aliases: ["postgres"] },
  {
    name: "VS Code",
    icon: "visual-studio-code",
    aliases: ["vscode", "visual studio code"],
  },
  { name: "Docker", icon: "docker", extra: "ic-land" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github", extra: "ic-ink" },
  { name: "Cloudflare", icon: "cloudflare", extra: "ic-wide" },
  { name: "WebStorm", icon: "webstorm" },
];

export const TECH_SUGGESTIONS = TECH_CATALOG.map(({ name }) => name);

// "Node.js", "node js" and "NODEJS" all share the key "nodejs".
const toKey = (name) => normalizeTech(name).toLowerCase().replace(/[\s.-]/g, "");

const BY_KEY = new Map();
for (const tech of TECH_CATALOG) {
  for (const label of [tech.name, ...(tech.aliases ?? [])]) {
    BY_KEY.set(toKey(label), tech);
  }
}

export const getTech = (name) => BY_KEY.get(toKey(name)) ?? null;

export const getTechIcon = (name) => {
  const tech = getTech(name);
  if (!tech) return null;
  return { src: `/assets/icons/${tech.icon}.svg`, className: tech.extra ?? "" };
};

export const getStack = (project) =>
  Array.isArray(project?.stack)
    ? project.stack.filter((tech) => typeof tech === "string" && tech)
    : [];
