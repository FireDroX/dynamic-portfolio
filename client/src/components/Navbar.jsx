import "./styles/Navbar.css";
import { NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { readObject, writeJson } from "../utils/storage";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage === "en" ? "en" : "fr";
  const nextLanguage = currentLanguage === "fr" ? "en" : "fr";
  const languageLabel = t(
    nextLanguage === "en" ? "nav.switchToEnglish" : "nav.switchToFrench",
  );

  const trackPage = (page) => {
    const explorer = readObject("portfolio_explorer");
    explorer[page] = true;
    writeJson("portfolio_explorer", explorer);

    if (explorer.home && explorer.about && explorer.projects) {
      window.dispatchEvent(new CustomEvent("portfolio:explorer"));
    }
  };

  return (
    <nav className="nav-header">
      <div className="navbar">
        <p>portfolio</p>
        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-active" : "")}
            onClick={() => trackPage("home")}
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
            onClick={() => trackPage("about")}
          >
            {t("nav.about")}
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
            onClick={() => trackPage("projects")}
          >
            {t("nav.projects")}
          </NavLink>
        </div>
        <div className="navbar-actions">
          <button
            type="button"
            className="language-switch"
            onClick={() => i18n.changeLanguage(nextLanguage)}
            aria-label={languageLabel}
            title={languageLabel}
          >
            <span className={currentLanguage === "fr" ? "lang-active" : ""}>
              FR
            </span>
            <span className={currentLanguage === "en" ? "lang-active" : ""}>
              EN
            </span>
          </button>
          <button
            type="button"
            className="navbar-panel"
            onClick={() => navigate("/panel")}
            aria-label={t("nav.login")}
            title={t("nav.login")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
