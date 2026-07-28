import { readArray, writeJson } from "../storage";
import { STORAGE_KEYS } from "./config";

function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function trackVisitAchievements() {
  const today = getLocalDayKey();
  const storedVisitDays = readArray(STORAGE_KEYS.visitDays).filter(
    (day) => typeof day === "string",
  );
  const hadPreviousVisitDay = storedVisitDays.some((day) => day !== today);
  const visitDays = storedVisitDays.includes(today)
    ? storedVisitDays
    : [...storedVisitDays, today];

  if (visitDays.length !== storedVisitDays.length) {
    writeJson(STORAGE_KEYS.visitDays, visitDays);
  }
  if (hadPreviousVisitDay) {
    window.dispatchEvent(new CustomEvent("portfolio:back-for-more"));
  }
  if (visitDays.length >= 3) {
    window.dispatchEvent(new CustomEvent("portfolio:regular-visitor"));
  }
}
