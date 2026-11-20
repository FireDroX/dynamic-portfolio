import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import i18n from "../../i18n";
import { showAchievementPopup, POPUP_LIFETIME } from "./popup";

const snake = { name: "Snake Git", emoji: "🐍" };

beforeAll(async () => {
  await i18n.changeLanguage("fr");
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("showAchievementPopup", () => {
  it("shows the unlocked side with the name, the description and the number", () => {
    const popup = showAchievementPopup(snake, { count: 7, total: 20 });
    const back = popup.querySelector(".achievement-popup__face--back");

    expect(back.querySelector(".achievement-popup__name").textContent).toBe(
      "Serpent Git",
    );
    expect(back.querySelector(".achievement-popup__desc").textContent).toBe(
      "Tssssssssssssssssssss",
    );
    expect(back.querySelector(".achievement-popup__foot").textContent).toContain(
      "N° 07/20",
    );
    expect(back.querySelector(".achievement-popup__sticker").textContent).toBe(
      "🐍",
    );
  });

  it("hides the locked side and the sticker from assistive tech", () => {
    const popup = showAchievementPopup(snake, { count: 1, total: 20 });

    expect(
      popup
        .querySelector(".achievement-popup__face--front")
        .getAttribute("aria-hidden"),
    ).toBe("true");
    expect(
      popup
        .querySelector(".achievement-popup__sticker")
        .getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("leaves the number out when the progress is unknown", () => {
    const popup = showAchievementPopup(snake);
    const foot = popup.querySelector(".achievement-popup__foot");

    expect(foot.textContent).not.toContain("N°");
    expect(foot.querySelector("time")).not.toBeNull();
  });

  it("removes itself once its animation is over", () => {
    vi.useFakeTimers();
    const popup = showAchievementPopup(snake, { count: 2, total: 20 });

    expect(document.body.contains(popup)).toBe(true);
    vi.advanceTimersByTime(POPUP_LIFETIME);
    expect(document.body.contains(popup)).toBe(false);
  });
});
