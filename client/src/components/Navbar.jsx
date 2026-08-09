import "./styles/Navbar.css";
import { NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageFlag from "./LanguageFlag";
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
        <div>
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
          <button
            type="button"
            className="language-switch"
            onClick={() => i18n.changeLanguage(nextLanguage)}
            aria-label={languageLabel}
            title={languageLabel}
          >
            <LanguageFlag language={nextLanguage} />
          </button>
        </div>
        <button onClick={() => navigate("/panel")}>{t("nav.login")}</button>
      </div>
    </nav>
  );
};

export default Navbar;
