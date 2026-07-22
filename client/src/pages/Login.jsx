import "./styles/Login.css";
import { useState } from "react";

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (res.ok) {
        onLogin();
        return;
      }

      setPassword("");
      setError("Mot de passe incorrect. Réessaie.");
      window.dispatchEvent(new CustomEvent("portfolio:wrong-password"));
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="App login-page">
      <section className="login-card">
        <div className="login-intro">
          <small>espace privé</small>
          <h1>Administration</h1>
          <p>
            Connecte-toi pour publier, prévisualiser et mettre à jour les
            projets du portfolio.
          </p>
          <div className="login-decoration" aria-hidden="true">
            <span>01</span>
            <div />
            <span>portfolio</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-heading">
            <span className="login-status-dot" />
            <p>Accès administrateur</p>
          </div>

          <label htmlFor="admin-password">Mot de passe</label>
          <div className="login-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ton mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="login-submit" disabled={loading}>
            {loading ? "Connexion..." : "Entrer dans le panel"}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
