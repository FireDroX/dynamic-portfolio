import "./styles/Achievements.css";
import achievementsList from "../utils/achievements.json";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Popup from "../components/Popup";
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

  const unlockedCount = achievementsList.filter((achievement) =>
    userAchievements.includes(formatAchievementName(achievement.name)),
  ).length;
  const completion = Math.round(
    (unlockedCount / achievementsList.length) * 100,
  );

  return (
    <main className="App achievements-page">
      <header className="achievements-header">
        <small>achievements</small>
        <h1>Secrets</h1>
        <p>{t("achievements.header")}</p>
      </header>

      <section
        className="achievements-progress"
        aria-label={t("achievements.progressLabel")}
      >
        <div className="achievements-progress-copy">
          <small>{t("achievements.progress")}</small>
          <p>
            {t("achievements.unlockedCount", {
              unlocked: unlockedCount,
              total: achievementsList.length,
            })}
          </p>
        </div>

        <div className="achievements-progress-track">
          <div className="achievements-progress-label">
            <span>
              {t(
                completion === 100
                  ? "achievements.complete"
                  : "achievements.inProgress",
              )}
            </span>
            <span>{completion}%</span>
          </div>
          <div
            className="achievements-progress-bar"
            role="progressbar"
            aria-label={t("achievements.unlockedLabel")}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={completion}
          >
            <span style={{ width: `${completion}%` }} />
          </div>
        </div>
      </section>

      <section className="achievements-collection">
        <div className="achievements-collection-title">
          <div>
            <small>{t("achievements.collection")}</small>
            <h2>{t("achievements.findThem")}</h2>
          </div>
          <p>{t("achievements.hintExplanation")}</p>
        </div>

        <div className="achievements-list">
          {achievementsList.map((achievement) => {
            const unlocked = userAchievements.includes(
              formatAchievementName(achievement.name),
            );

            return (
              <Popup
                key={achievement.name}
                achievement={achievement}
                unlocked={unlocked}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Achievements;
