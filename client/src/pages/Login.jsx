import "./styles/Login.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
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
      setError(t("login.wrongPassword"));
      window.dispatchEvent(new CustomEvent("portfolio:wrong-password"));
    } catch {
      setError(t("login.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="App login-page">
      <section className="login-card">
        <div className="login-intro">
          <small>{t("login.privateArea")}</small>
          <h1>{t("login.title")}</h1>
          <p>{t("login.description")}</p>
          <div className="login-decoration" aria-hidden="true">
            <span>01</span>
            <div />
            <span>portfolio</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-heading">
            <span className="login-status-dot" />
            <p>{t("login.adminAccess")}</p>
          </div>

          <label htmlFor="admin-password">{t("login.password")}</label>
          <div className="login-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={t(
                showPassword ? "login.hidePassword" : "login.showPassword",
              )}
            >
              {t(showPassword ? "login.hide" : "login.show")}
            </button>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-submit" disabled={loading}>
            {t(loading ? "login.loading" : "login.submit")}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
