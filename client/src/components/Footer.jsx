import "./styles/Footer.css";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import credits from "../utils/credits";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" };

const Footer = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const handleCount = () => {
    setCount((prev) => prev + 1);
    if (count + 1 === 3) {
      window.dispatchEvent(new CustomEvent("portfolio:&cᴏpy;"));
    }
  };

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="grid">
          <div className="span-6 stack-4">
            <Link to="/" className="nav__logo">
              <span className="mark" data-mark="stack" aria-hidden="true" />
              Adrien
            </Link>
            <p className="footer__lede">{t("footer.lede")}</p>
          </div>
          <div className="span-2 footer__col">
            <h3>{t("footer.navigation")}</h3>
            <ul>
              <li>
                <Link to="/">{t("nav.home")}</Link>
              </li>
              <li>
                <Link to="/projects">{t("nav.projects")}</Link>
              </li>
              <li>
                <Link to="/about">{t("nav.about")}</Link>
              </li>
            </ul>
          </div>
          <div className="span-2 footer__col">
            <h3>{t("footer.contact")}</h3>
            <ul>
              <li>
                <a href="mailto:contact@addrien.fr">{t("footer.email")}</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/adrien-pourlier/" {...EXTERNAL}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/FireDroX" {...EXTERNAL}>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div className="span-2 footer__col">
            <h3>{t("footer.legalTitle")}</h3>
            <ul>
              <li>
                <Link to="/mentions-legales">{t("footer.legal")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__legal">
          <span>
            &copy;{" "}
            <button
              type="button"
              className="footer__copyright"
              onClick={handleCount}
              aria-label="Copyright"
            >
              {new Date().getFullYear()}
            </button>{" "}
            {t("footer.rights")}
          </span>
          {credits.length > 0 && (
            <p className="credits">
              {t("footer.credits")}{" "}
              {credits.map((credit, index) => (
                <span key={credit.label}>
                  {index > 0 && ", "}
                  {credit.href ? (
                    <a href={credit.href} {...EXTERNAL}>
                      {credit.label}
                    </a>
                  ) : (
                    credit.label
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
