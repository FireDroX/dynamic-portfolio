import "./styles/Footer.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <footer>
      <p>
        &copy;{" "}
        <button
          type="button"
          className="footer-copyright"
          onClick={handleCount}
          aria-label="Copyright"
        >
          {new Date().getFullYear()}
        </button>{" "}
        <span>{t("footer.rights")}</span>
      </p>
      <div>
        <a
          href="https://www.linkedin.com/in/adrien-pourlier"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linkedin
        </a>
        <a
          href="https://github.com/FireDroX"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a href="/mentions-legales" target="_blank" rel="noopener noreferrer">
          {t("footer.legal")}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
