import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <span className="footer-copyright">Tous droits réservés.</span>
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
      </div>
    </footer>
  );
};

export default Footer;
