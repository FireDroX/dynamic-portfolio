import "../components/styles/Popup.css";
import achievements_list from "../utils/achievements_list.json";

import Popup from "../components/Popup";

const Achievements = () => {
  const userAchievements = JSON.parse(
    localStorage.getItem("portfolio_achievements") || "[]",
  );

  if (!userAchievements.includes("hidden-page")) {
    window.dispatchEvent(new CustomEvent("portfolio:hidden-page"));
  }

  return (
    <div className="App">
      <header>
        <small>achievements</small>
        <h1>Secret</h1>
      </header>
      <div className="achievements-list">
        {achievements_list.map((a) => {
          const unlocked = userAchievements.includes(
            a.name.toLowerCase().trim().replace(" ", "-"),
          );
          return <Popup key={a.name} achievement={a} unlocked={unlocked} />;
        })}
      </div>
    </div>
  );
};

export default Achievements;
