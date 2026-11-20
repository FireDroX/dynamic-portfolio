import "../../components/styles/Popup.css";
import i18n from "../../i18n";
import { formatAchievementName } from "./config";

// Matches the achievement-toast animation in Popup.css.
export const POPUP_LIFETIME = 5000;

function getPopupContainer() {
  let container = document.getElementById("achievement-popup-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "achievement-popup-container";
    document.body.appendChild(container);
  }

  return container;
}

function create(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const pad = (value) => String(value).padStart(2, "0");

// The card arrives as the locked trophy of /achievements, flips over, then the
// emoji lands on it as a sticker. The front is decorative only.
function createFront(achievement) {
  const front = create(
    "div",
    "achievement-popup__face achievement-popup__face--front",
  );
  front.setAttribute("aria-hidden", "true");

  const icon = create("div", "achievement-popup__icon");
  icon.append(create("span", "achievement-popup__silhouette", achievement.emoji));

  const body = create("div", "achievement-popup__locked");
  body.append(
    create("small", "achievement-popup__label", i18n.t("achievements.locked")),
    create("i", "achievement-popup__bar"),
    create("i", "achievement-popup__bar achievement-popup__bar--short"),
  );

  front.append(icon, body);
  return front;
}

function createBack(achievement, { count, total }) {
  const translationKey = `achievements.items.${formatAchievementName(achievement.name)}`;
  const back = create(
    "div",
    "achievement-popup__face achievement-popup__face--back",
  );

  const sticker = create("span", "achievement-popup__sticker", achievement.emoji);
  sticker.setAttribute("aria-hidden", "true");

  const footer = create("div", "achievement-popup__foot");
  if (Number.isFinite(count) && Number.isFinite(total)) {
    footer.append(
      create(
        "span",
        "",
        i18n.t("achievements.popupNumber", {
          count: pad(count),
          total: pad(total),
        }),
      ),
    );
  }
  const now = new Date();
  const date = create(
    "time",
    "",
    new Intl.DateTimeFormat(i18n.language).format(now),
  );
  date.dateTime = now.toISOString().slice(0, 10);
  footer.append(date);

  back.append(
    sticker,
    create(
      "small",
      "achievement-popup__label achievement-popup__label--ok",
      i18n.t("achievements.popupLabel"),
    ),
    create("strong", "achievement-popup__name", i18n.t(`${translationKey}.name`)),
    create(
      "span",
      "achievement-popup__desc",
      i18n.t(`${translationKey}.description`),
    ),
    footer,
  );

  return back;
}

export function showAchievementPopup(achievement, progress = {}) {
  const popup = create("div", "achievement-popup");
  popup.setAttribute("role", "status");

  const flip = create("div", "achievement-popup__flip");
  flip.append(createFront(achievement), createBack(achievement, progress));
  popup.append(flip);
  getPopupContainer().appendChild(popup);

  setTimeout(() => popup.remove(), POPUP_LIFETIME);
  return popup;
}
