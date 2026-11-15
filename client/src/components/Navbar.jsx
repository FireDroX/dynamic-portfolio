import "./styles/Navbar.css";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import useNavSheet from "../hooks/useNavSheet";
import { readObject, writeJson } from "../utils/storage";

const trackPage = (page) => {
  const explorer = readObject("portfolio_explorer");
  explorer[page] = true;
  writeJson("portfolio_explorer", explorer);

  if (explorer.home && explorer.about && explorer.projects) {
    window.dispatchEvent(new CustomEvent("portfolio:explorer"));
  }
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { open, close, toggle } = useNavSheet();
  const currentLanguage = i18n.resolvedLanguage === "en" ? "en" : "fr";
  const nextLanguage = currentLanguage === "fr" ? "en" : "fr";
  const languageLabel = t(
    nextLanguage === "en" ? "nav.switchToEnglish" : "nav.switchToFrench",
  );
  const toggleLabel = t(open ? "nav.closeMenu" : "nav.openMenu");

  return (
    <header
      className={`nav nav--centre${open ? " is-open" : ""}`}
      onClick={(event) => {
        if (open && event.target.closest("a[href]")) close();
      }}
    >
      <div className="wrap nav__bar">
        <Link to="/" className="nav__logo" onClick={() => trackPage("home")}>
          <span className="mark" data-mark="stack" aria-hidden="true" />
          Adrien
        </Link>
        <nav className="nav__links" aria-label={t("nav.label")}>
          <div className="nav__item">
            <NavLink
              to="/"
              end
              className="nav__link"
              onClick={() => trackPage("home")}
            >
              {t("nav.home")}
            </NavLink>
          </div>
          <div className="nav__item">
            <NavLink
              to="/projects"
              className="nav__link"
              onClick={() => trackPage("projects")}
            >
              {t("nav.projects")}
            </NavLink>
          </div>
          <div className="nav__item">
            <NavLink
              to="/about"
              className="nav__link"
              onClick={() => trackPage("about")}
            >
              {t("nav.about")}
            </NavLink>
          </div>
          <div className="nav__item">
            <Link to="/#contact" className="nav__link">
              {t("nav.contact")}
            </Link>
          </div>
        </nav>
        <div className="nav__actions">
          <button
            type="button"
            className="nav__lang"
            onClick={() => i18n.changeLanguage(nextLanguage)}
            aria-label={languageLabel}
            title={languageLabel}
          >
            <span aria-current={currentLanguage === "fr" || undefined}>FR</span>
            <span aria-current={currentLanguage === "en" || undefined}>EN</span>
          </button>
          <Link
            to="/panel"
            className="nav__panel"
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
          </Link>
        </div>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-label={toggleLabel}
          onClick={toggle}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d={open ? "M4 4l10 10M14 4L4 14" : "M2 5h14M2 13h14"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
