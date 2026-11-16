import "./styles/Login.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppFrame from "../components/ui/AppFrame";
import Button from "../components/ui/Button";

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
    <main className="login-page">
      <section className="login-card">
        <div className="login-intro">
          <p className="t-label">{t("login.privateArea")}</p>
          <h1>{t("login.title")}</h1>
          <p className="muted">{t("login.description")}</p>
        </div>

        <AppFrame title={t("login.adminAccess")} bodyClassName="login-body">
          <form className="login-form" onSubmit={handleLogin}>
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
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "login-error" : undefined}
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
              <p className="login-error" id="login-error" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={loading} aria-busy={loading}>
              {t(loading ? "login.loading" : "login.submit")}
            </Button>
          </form>
        </AppFrame>
      </section>
    </main>
  );
};

export default Login;
