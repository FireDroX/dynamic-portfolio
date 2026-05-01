import "./styles/About.css";

const About = () => {
  const calcDays = () => {
    const birthDate = new Date("2004-12-13");
    const today = new Date();

    const diffTime = today - birthDate;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return days;
  };

  return (
    <div className="App">
      <header>
        <small>portfolio</small>
        <h1>Adrien</h1>
        <p>
          Je suis <strong>Adrien</strong>, je suis sur Terre depuis{" "}
          <mark className="mark-daysalive">{calcDays()}</mark> jours.
        </p>
        <p>
          Je suis développeur <strong>web</strong> et étudiant en informatique à
          l’
          <strong>ESGI</strong>.
        </p>
        <br />
        <p>
          Je conçois et développe des projets en JavaScript, notamment avec{" "}
          <strong>React</strong> et <strong>Node.js</strong>.
          <br />
        </p>
        <br />
        <p>
          Ce portfolio est un espace où j’expérimente, j’apprends et je
          construis différents projets que tu peux tester directement en ligne.
        </p>
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcSet="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake-dark.svg"
          />
          <source
            media="(prefers-color-scheme: light)"
            srcSet="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake.svg"
          />
          <img
            className="snake-svg"
            alt="github-snake"
            src="https://raw.githubusercontent.com/FireDroX/FireDroX/refs/heads/output/github-snake-dark.svg"
            style={{ cursor: "pointer" }}
            title="Snake - GitHub"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("portfolio:snake-git"));
            }}
          />
        </picture>
      </header>
      <img
        className="skills-svg"
        src="https://skillicons.dev/icons?i=c,html,css,react,nodejs,express,mysql,postgres,docker,aws,git,github,figma&theme=dark"
      />
      <br />
      <a href="https://ko-fi.com/G2G01YFONH" target="_blank">
        <img
          style={{ border: "0px", height: "36px" }}
          src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
          border="0"
          alt="Buy Me a Coffee at ko-fi.com"
        />
      </a>
    </div>
  );
};

export default About;
