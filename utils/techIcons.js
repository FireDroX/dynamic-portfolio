// Brand icons for technologies the panel's catalog does not know, looked up
// in Simple Icons (CC0) by title, slug or alias. Served by the API so a new
// technology gets its logo without shipping the whole set (~5 MB) to visitors.

// "Socket.io", "socket io" and "SOCKETIO" all share the key "socketio".
const toKey = (name) =>
  String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s._-]/g, "");

let index = null;

// Built on first use: the package is large, most requests never need it.
function getIndex() {
  if (index) return index;

  const icons = Object.values(require("simple-icons"));
  const data = require("simple-icons/icons.json");
  const bySlug = new Map(icons.map((icon) => [icon.slug, icon]));

  index = new Map();
  const add = (key, icon) => {
    if (key && icon && !index.has(key)) index.set(key, icon);
  };

  // Titles and slugs first, so an alias never shadows a real name.
  for (const icon of icons) add(toKey(icon.title), icon);
  for (const icon of icons) add(toKey(icon.slug), icon);
  for (const entry of data) {
    const icon = bySlug.get(entry.slug);
    for (const alias of entry.aliases?.aka ?? []) add(toKey(alias), icon);
  }

  return index;
}

// { title, hex, path } for a known technology, null otherwise.
function resolveTechIcon(name) {
  const key = toKey(name);
  if (!key) return null;
  const icon = getIndex().get(key);
  return icon ? { title: icon.title, hex: icon.hex, path: icon.path } : null;
}

module.exports = { resolveTechIcon, toKey };
