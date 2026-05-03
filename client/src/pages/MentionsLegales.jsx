import "./styles/About.css";

const MentionsLegales = () => {
  const Jump = ({ br = 1 }) => {
    return (
      <>
        {Array.from({ length: br }).map((_, i) => (
          <br key={i} />
        ))}
      </>
    );
  };
  return (
    <div className="App">
      <header>
        <small>Mentions & confidentialité</small>
        <h2>Informations légales</h2>
        <p>
          <b>Éditeur du site</b>: Adrien POURLIER
          <Jump br={2} />
          <b>Contact</b>:{" "}
          <a href="mailto:contact@addrien.fr">contact@addrien.fr</a>
          <Jump br={2} />
          <b>Hébergement</b>: le site et les services associés sont hébergés sur
          une infrastructure personnelle, située en France, exploitée par
          l’éditeur.
          <Jump br={1} />
          Il ne s’agit pas d’un hébergeur commercial tiers : la disponibilité et
          la maintenance relèvent de l’éditeur.
        </p>
        <Jump br={3} />
        <h2>Politique de confidentialité</h2>
        <p>
          Le présent site ne propose{" "}
          <b>aucune création de compte utilisateur</b> et ne collecte{" "}
          <b>aucune donnée personnelle directement saisie par les visiteurs</b>.
          <Jump br={2} />
          Aucune donnée personnelle n’est enregistrée, stockée ou exploitée par
          l’éditeur dans le cadre de l’utilisation normale du site.{" "}
        </p>
        <Jump br={3} />
        <h2>Responsabilité</h2>
        <p>
          L’éditeur ne peut être tenu responsable des erreurs ou
          indisponibilités du site.
        </p>
        <Jump br={3} />
        <h2>Cookies et stockage local</h2>
        <p>
          Ce site utilise le <b>stockage local du navigateur (localStorage)</b>{" "}
          afin d’assurer certaines fonctionnalités liées à l’expérience
          utilisateur.
          <Jump br={2} />
          Les données suivantes peuvent être enregistrées localement sur votre
          appareil :
          <Jump br={2} />
          <ul className="about-stack">
            <li>
              <span>portfolio_achievements</span>: liste des succès
              (achievements) débloqués par l’utilisateur
            </li>
            <li>
              <span>portfolio_visited</span>: nombre de visites effectuées sur
              le site, utilisé pour débloquer certains succès
            </li>
            <li>
              <span>portfolio_explorer</span>: objet contenant des indicateurs
              (true/false) permettant de savoir si certaines pages du site ont
              été consultées, dans le cadre de l’obtention de succès
            </li>
          </ul>
          <Jump br={1} />
          Ces données sont stockées uniquement sur votre navigateur et{" "}
          <b>
            ne sont ni transmises à un tiers, ni utilisées à des fins
            publicitaires.
          </b>
          <Jump br={2} />
          <b>Finalité</b>: Ces traceurs sont utilisés exclusivement pour
          améliorer l’expérience utilisateur et proposer des fonctionnalités
          ludiques (système de succès).
          <Jump br={2} />
          <b>Durée de conservation</b>: Les données sont conservées jusqu’à leur
          suppression manuelle par l’utilisateur via les paramètres de son
          navigateur.
          <Jump br={2} />
          <b>Base légale</b>: Ces mécanismes reposent sur l’intérêt légitime de
          l’éditeur, dans la mesure où ils sont strictement nécessaires au
          fonctionnement et aux fonctionnalités du site.
          <Jump br={1} />
          Vous pouvez à tout moment supprimer ces données en vidant le stockage
          local de votre navigateur.
        </p>
      </header>
    </div>
  );
};

export default MentionsLegales;
