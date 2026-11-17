import { INK_COLOR, normalizeTech } from "./techStack";

// Technologies missing from TECH_CATALOG get their logo from the server
// (Simple Icons, /api/tech-icons). One request per name per page load,
// shared by every pill showing it; failures count as "no icon".
const cache = new Map();

const toKey = (name) => normalizeTech(name).toLowerCase();

export const fetchTechIcon = (name) => {
  const key = toKey(name);
  if (!key) return Promise.resolve(null);
  if (cache.has(key)) return cache.get(key);

  const request =
    typeof fetch === "function"
      ? fetch(`/api/tech-icons?name=${encodeURIComponent(normalizeTech(name))}`)
          .then((response) => (response.ok ? response.json() : null))
          .then((icon) =>
            icon && typeof icon.path === "string" ? icon : null,
          )
          .catch(() => null)
      : Promise.resolve(null);

  cache.set(key, request);
  return request;
};

export const clearTechIconCache = () => cache.clear();

// Relative luminance of a "RRGGBB" color, 0 (black) to 1 (white).
const luminance = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Brand color, except near-black and near-white marks, which would vanish on
// one of the two themes: those follow the theme ink like the catalog does.
export const getIconColor = (hex) => {
  if (!/^[0-9a-f]{6}$/i.test(hex ?? "")) return INK_COLOR;
  const value = luminance(hex);
  return value < 0.02 || value > 0.8 ? INK_COLOR : `#${hex}`;
};
