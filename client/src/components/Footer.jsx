import "./styles/Footer.css";
import { useState } from "react";

const Footer = () => {
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
        <span className="footer-copyright" onClick={handleCount}>
          {new Date().getFullYear()}
        </span>{" "}
        <span>Tous droits réservés.</span>
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
          Mentions Légales
        </a>
      </div>
    </footer>
  );
};

export default Footer;
