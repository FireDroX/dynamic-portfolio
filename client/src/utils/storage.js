export const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const readArray = (key) => {
  const value = readJson(key, []);
  return Array.isArray(value) ? value : [];
};

export const readObject = (key) => {
  const value = readJson(key, {});
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
};

export const readNumber = (key, fallback = 0) => {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

export const writeNumber = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
};
