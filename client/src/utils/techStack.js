import {
  SiCloudflare,
  SiCss,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiProxmox,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiWebstorm,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

// Single source of truth linking a technology name to its react-icons glyph.
// Marks without a `color` are black/white logos and follow the theme ink.
export const INK_COLOR = "var(--p-ink)";

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
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", aliases: ["js"] },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", aliases: ["ts"] },
  { name: "HTML", Icon: SiHtml5, color: "#E34F26", aliases: ["html5"] },
  { name: "CSS", Icon: SiCss, color: "#1572B6", aliases: ["css3"] },
  {
    name: "Tailwind CSS",
    Icon: SiTailwindcss,
    color: "#06B6D4",
    aliases: ["tailwind"],
  },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E", aliases: ["node"] },
  { name: "Express", Icon: SiExpress, aliases: ["express.js"] },
  { name: "NestJS", Icon: SiNestjs, color: "#E0234E", aliases: ["nest"] },
  { name: "PHP", Icon: SiPhp, color: "#777BB4" },
  { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
  {
    name: "PostgreSQL",
    Icon: SiPostgresql,
    color: "#4169E1",
    aliases: ["postgres"],
  },
  {
    name: "VS Code",
    Icon: VscVscode,
    color: "#007ACC",
    aliases: ["vscode", "visual studio code"],
  },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub },
  { name: "Cloudflare", Icon: SiCloudflare, color: "#F38020" },
  {
    name: "Proxmox",
    Icon: SiProxmox,
    color: "#E57000",
    aliases: ["proxmox ve"],
  },
  { name: "WebStorm", Icon: SiWebstorm, color: "#07C3F2" },
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
  return { Icon: tech.Icon, color: tech.color ?? INK_COLOR };
};

export const getStack = (project) =>
  Array.isArray(project?.stack)
    ? project.stack.filter((tech) => typeof tech === "string" && tech)
    : [];
