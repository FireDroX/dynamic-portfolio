import "./styles/Achievements.css";
import achievementsList from "../utils/achievements.json";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Popup from "../components/Popup";
import Section from "../components/ui/Section";
import useCountUp from "../hooks/useCountUp";
import { formatAchievementName } from "../utils/achievements/config";
import { readArray } from "../utils/storage";

const Achievements = () => {
  const { t } = useTranslation();
  const [userAchievements, setUserAchievements] = useState(() =>
    readArray("portfolio_achievements"),
  );

  useEffect(() => {
    const handleStorage = () => {
      setUserAchievements(readArray("portfolio_achievements"));
    };

    window.addEventListener("portfolio:update", handleStorage);
    return () => window.removeEventListener("portfolio:update", handleStorage);
  }, []);

  useEffect(() => {
    if (!userAchievements.includes("hidden-page")) {
      window.dispatchEvent(new CustomEvent("portfolio:hidden-page"));
    }
  }, [userAchievements]);

  const total = achievementsList.length;
  const unlockedCount = achievementsList.filter((achievement) =>
    userAchievements.includes(formatAchievementName(achievement.name)),
  ).length;
  const completion = Math.round((unlockedCount / total) * 100);
  const animated = useCountUp(unlockedCount);

  return (
    <main className="achv">
      <Section className="hero achv__hero" data-enter>
        <div className="hero-text hero-copy">
          <p className="achv__eyebrow">{t("achievements.eyebrow")}</p>
          <h1>{t("achievements.secretsLabel")}</h1>
          <p className="achv__lead">{t("achievements.header")}</p>

          <div className="achv__progress">
            <p
              className="achv__count"
              aria-label={t("achievements.unlockedCount", {
                unlocked: unlockedCount,
                total,
              })}
            >
              <span className="achv__count-num" aria-hidden="true">
                {animated}
              </span>
              <span aria-hidden="true"> / {total}</span>
            </p>
            <div
              className="achv__bar"
              role="progressbar"
              aria-label={t("achievements.progressLabel")}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={completion}
            >
              <span style={{ width: `${completion}%` }} />
            </div>
            <p className="achv__status">
              {t(
                completion === 100
                  ? "achievements.complete"
                  : "achievements.inProgress",
              )}
            </p>
          </div>
        </div>
      </Section>

      <Section className="achv__collection">
        <h2>{t("achievements.findThem")}</h2>
        <p className="achv__note">{t("achievements.hintExplanation")}</p>
        <ul className="achv__grid">
          {achievementsList.map((achievement) => {
            const unlocked = userAchievements.includes(
              formatAchievementName(achievement.name),
            );

            return (
              <li key={achievement.name}>
                <Popup achievement={achievement} unlocked={unlocked} />
              </li>
            );
          })}
        </ul>
      </Section>
    </main>
  );
};

export default Achievements;
