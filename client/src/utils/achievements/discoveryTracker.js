import achievements, {
  formatAchievementName,
  SPECIAL_ACHIEVEMENTS,
} from "./config";

const KEYBOARD_TARGETS = [
  "adrien",
  "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba",
];

function registerKeyboardTracker() {
  let typed = "";

  window.addEventListener("keyup", (event) => {
    typed += event.key.toLowerCase();

    if (!KEYBOARD_TARGETS.some((target) => target.startsWith(typed))) {
      typed = "";
      return;
    }

    if (typed === KEYBOARD_TARGETS[0]) {
      window.dispatchEvent(new CustomEvent("portfolio:thats-me"));
      typed = "";
    }
    if (typed === KEYBOARD_TARGETS[1]) {
      window.dispatchEvent(new CustomEvent("portfolio:konami-code"));
      typed = "";
    }
  });
}

function trackEnvironmentAchievements() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    window.dispatchEvent(new CustomEvent("portfolio:burning-eyes"));
  }

  const source = new URLSearchParams(window.location.search).get("utm_source");
  if (source === "linkedin") {
    window.dispatchEvent(new CustomEvent("portfolio:recruiter"));
  }
  if (source === "github") {
    window.dispatchEvent(new CustomEvent("portfolio:nerd"));
  }
}

// Only achievement events can come from a project: internal ones such as
// "portfolio:cheater" (wipes progress) or "portfolio:update" are never forwarded.
const IFRAME_EVENTS = new Set(
  achievements
    .map((achievement) => formatAchievementName(achievement.name))
    .filter((name) => !SPECIAL_ACHIEVEMENTS.has(name))
    .map((name) => `portfolio:${name}`),
);

const isProjectFrame = (source) =>
  Array.from(document.querySelectorAll("iframe")).some(
    (frame) => frame.contentWindow === source,
  );

function registerIframeBridge() {
  window.addEventListener("message", (event) => {
    // "null" is the origin of the sandboxed panel preview.
    const isTrustedOrigin =
      event.origin === window.location.origin || event.origin === "null";

    if (
      isTrustedOrigin &&
      IFRAME_EVENTS.has(event.data?.type) &&
      isProjectFrame(event.source)
    ) {
      window.dispatchEvent(new CustomEvent(event.data.type));
    }
  });
}

export function registerDiscoveryTracker() {
  trackEnvironmentAchievements();
  registerKeyboardTracker();
  registerIframeBridge();
}
