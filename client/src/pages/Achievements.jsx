import "../components/styles/Popup.css";
import achievements_list from "../utils/achievements.json";
import { useEffect, useState } from "react";

import Popup from "../components/Popup";

const Achievements = () => {
  const [userAchievements, setUserAchievements] = useState(() => {
    return JSON.parse(localStorage.getItem("portfolio_achievements") || "[]");
  });

  useEffect(() => {
    const handleStorage = () => {
      const updated = JSON.parse(
        localStorage.getItem("portfolio_achievements") || "[]",
      );
      setUserAchievements(updated);
    };

    window.addEventListener("portfolio:update", handleStorage);

    return () => {
      window.removeEventListener("portfolio:update", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!userAchievements.includes("hidden-page")) {
      window.dispatchEvent(new CustomEvent("portfolio:hidden-page"));
    }
  }, [userAchievements]);

  return (
    <div className="App">
      <header>
        <small>achievements</small>
        <h1>Secrets</h1>
      </header>

      <div className="achievements-list">
        {achievements_list.map((a) => {
          const unlocked = userAchievements.includes(
            a.name.toLowerCase().trim().replace(/\s+/g, "-"),
          );

          return <Popup key={a.name} achievement={a} unlocked={unlocked} />;
        })}
      </div>
    </div>
  );
};

export default Achievements;
