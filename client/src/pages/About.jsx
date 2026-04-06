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
          <strong>{calcDays()}</strong> jours.
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
        </p>
        <br />
        <p>
          Ce portfolio est un espace où j’expérimente, j’apprends et je
          construis différents projets que tu peux tester directement en ligne.
        </p>
      </header>
      <div className="blank"></div>
    </div>
  );
};

export default About;
