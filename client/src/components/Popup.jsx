import "./styles/Popup.css";

const Popup = ({ achievement, unlocked }) => {
  const { name, description, emoji, hint } = achievement;

  return (
    <article className={`achievement ${unlocked ? "unlocked" : "locked"}`}>
      <div className="achievement-card-top">
        <div className="achievement-icon" aria-hidden="true">
          {unlocked ? emoji : "?"}
        </div>
        <span className="achievement-state">
          <i aria-hidden="true" />
          {unlocked ? "Débloqué" : "Verrouillé"}
        </span>
      </div>

      <div className="achievement-content">
        <small>{unlocked ? "Achievement" : "Indice"}</small>
        <h3>{unlocked ? name : "Secret inconnu"}</h3>
        <p>{unlocked ? description : hint}</p>
      </div>
    </article>
  );
};

export default Popup;
