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

function registerIframeBridge() {
  window.addEventListener("message", (event) => {
    if (
      event.origin === window.location.origin &&
      typeof event.data?.type === "string"
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
