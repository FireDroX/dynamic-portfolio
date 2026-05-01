import "./styles/Popup.css";

const Popup = ({ achievement, unlocked }) => {
  const { name, description, emoji } = achievement;
  return (
    <div className="achievement">
      <div>{unlocked ? emoji : "❓"}</div>
      <div>
        <h3>{unlocked ? name : "???"}</h3>
        <p>{unlocked ? description : "???"}</p>
      </div>
    </div>
  );
};

export default Popup;
