import "./styles/Popup.css";

const Popup = ({ achievement, unlocked }) => {
  const { name, description, emoji, hint } = achievement;
  return (
    <div className={`achievement ${unlocked ? "" : "locked"}`}>
      <div>{unlocked ? emoji : "❓"}</div>
      <div>
        <h3>{unlocked ? name : "???"}</h3>
        <p>{unlocked ? description : hint}</p>
      </div>
    </div>
  );
};

export default Popup;
