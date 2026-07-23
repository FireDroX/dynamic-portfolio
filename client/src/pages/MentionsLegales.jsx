import "./styles/MentionsLegales.css";

const storageEntries = [
  {
    key: "portfolio_achievements",
    purpose: "Mémorise les achievements débloqués.",
  },
  {
    key: "portfolio_visited",
    purpose: "Compte les visites nécessaires à certains achievements.",
  },
  {
    key: "portfolio_explorer",
    purpose: "Mémorise les pages déjà explorées.",
  },
  {
    key: "portfolio_viewed_projects",
    purpose: "Mémorise les projets consultés sans enregistrer leur contenu.",
  },
  {
    key: "portfolio_visit_days",
    purpose: "Mémorise les jours de visite pour les achievements de retour.",
  },
];

const MentionsLegales = () => (
  <main className="App legal-page">
    <header className="legal-header">
      <small>mentions & confidentialité</small>
      <h1>Informations légales</h1>
      <p>
        Informations relatives à l’édition du portfolio, à son hébergement et
        aux données utilisées pour son fonctionnement.
      </p>
      <time dateTime="2026-07-23">Mise à jour le 23 juillet 2026</time>
    </header>

    <nav className="legal-nav" aria-label="Sommaire des mentions légales">
      <a href="#edition">Édition</a>
      <a href="#hebergement">Hébergement</a>
      <a href="#confidentialite">Confidentialité</a>
      <a href="#stockage">Stockage local</a>
      <a href="#services">Services externes</a>
      <a href="#droits">Vos droits</a>
    </nav>

    <div className="legal-content">
      <section className="legal-section" id="edition">
        <div className="legal-section-title">
          <small>identification</small>
          <h2>Édition du site</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Ce portfolio est édité à titre personnel et non professionnel par
            Adrien POURLIER, également directeur de la publication.
          </p>
          <dl className="legal-details">
            <div>
              <dt>Éditeur</dt>
              <dd>Adrien POURLIER</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                <a href="mailto:contact@addrien.fr">contact@addrien.fr</a>
              </dd>
            </div>
            <div>
              <dt>Sites concernés</dt>
              <dd>addrien.fr · portfolio.addrien.fr</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="legal-section" id="hebergement">
        <div className="legal-section-title">
          <small>infrastructure</small>
          <h2>Hébergement</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Le site, son API et les projets présentés sont hébergés en France
            sur une infrastructure personnelle administrée par l’éditeur.
            Docker assure l’exécution des services et Cloudflare Tunnel leur
            mise à disposition sécurisée sur Internet.
          </p>
          <p>
            La disponibilité, la maintenance et la sauvegarde de cette
            infrastructure relèvent directement de l’éditeur.
          </p>
        </div>
      </section>

      <section className="legal-section" id="confidentialite">
        <div className="legal-section-title">
          <small>données</small>
          <h2>Confidentialité</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Le portfolio ne propose pas de compte visiteur, de formulaire de
            contact, de publicité ou d’outil de mesure d’audience. Aucune donnée
            n’est vendue ni utilisée pour établir un profil publicitaire.
          </p>
          <p>
            Comme pour tout service web, des informations techniques telles que
            l’adresse IP, la date de connexion, la ressource demandée ou le type
            de navigateur peuvent être traitées temporairement par le serveur
            et les intermédiaires réseau pour acheminer les requêtes, maintenir
            le service et assurer sa sécurité.
          </p>
          <aside className="legal-note">
            Les messages envoyés à l’adresse de contact sont traités uniquement
            afin de répondre à leur auteur.
          </aside>
        </div>
      </section>

      <section className="legal-section" id="stockage">
        <div className="legal-section-title">
          <small>navigateur</small>
          <h2>Cookies et stockage local</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Le système d’achievements utilise le <code>localStorage</code> du
            navigateur. Ces informations restent sur l’appareil utilisé et ne
            sont pas envoyées au serveur.
          </p>

          <div className="legal-storage-list">
            {storageEntries.map((entry) => (
              <div key={entry.key}>
                <code>{entry.key}</code>
                <p>{entry.purpose}</p>
              </div>
            ))}
          </div>

          <p>
            Ces entrées sont conservées jusqu’à leur suppression depuis les
            paramètres du navigateur. Leur suppression réinitialise tout ou
            partie de la progression des achievements.
          </p>
          <p>
            Un cookie de session strictement fonctionnel peut également être
            utilisé pour authentifier l’espace d’administration. Il n’est pas
            destiné au suivi des visiteurs et expire avec la session du
            navigateur.
          </p>
        </div>
      </section>

      <section className="legal-section" id="services">
        <div className="legal-section-title">
          <small>tiers</small>
          <h2>Services externes</h2>
        </div>
        <div className="legal-section-body">
          <p>Selon la page consultée, le navigateur peut contacter :</p>
          <ul className="legal-list">
            <li>
              <strong>Cloudflare</strong>, pour l’accès sécurisé au site ;
            </li>
            <li>
              <strong>Google Fonts</strong>, pour charger la police Manrope ;
            </li>
            <li>
              <strong>GitHub</strong>, pour afficher l’animation des
              contributions ;
            </li>
            <li>
              les services nécessaires aux projets interactifs intégrés dans
              les iframes.
            </li>
          </ul>
          <p>
            Les liens vers GitHub, LinkedIn ou Ko-fi ouvrent des sites distincts
            disposant de leurs propres politiques de confidentialité.
          </p>
        </div>
      </section>

      <section className="legal-section" id="propriete">
        <div className="legal-section-title">
          <small>contenus</small>
          <h2>Propriété intellectuelle</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Sauf indication contraire, les textes, interfaces, éléments
            graphiques et projets présentés sur ce portfolio sont la propriété
            de leur auteur. Toute reproduction ou réutilisation substantielle
            nécessite son autorisation préalable.
          </p>
          <p>
            Les marques, bibliothèques, ressources et services tiers restent la
            propriété de leurs titulaires respectifs.
          </p>
        </div>
      </section>

      <section className="legal-section" id="responsabilite">
        <div className="legal-section-title">
          <small>utilisation</small>
          <h2>Responsabilité</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Les informations et démonstrations sont fournies à titre
            informatif. Malgré le soin apporté au portfolio, l’éditeur ne peut
            garantir une disponibilité permanente ni l’absence totale
            d’erreurs. Les liens externes et leurs contenus ne relèvent pas de
            sa responsabilité.
          </p>
        </div>
      </section>

      <section className="legal-section" id="droits">
        <div className="legal-section-title">
          <small>contact</small>
          <h2>Vos droits</h2>
        </div>
        <div className="legal-section-body">
          <p>
            Pour toute question relative à ces informations, à une donnée
            personnelle ou à un contenu publié, vous pouvez écrire à l’adresse
            suivante :{" "}
            <a href="mailto:contact@addrien.fr">contact@addrien.fr</a>.
          </p>
          <div className="legal-references">
            <a
              href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164"
              target="_blank"
              rel="noopener noreferrer"
            >
              Loi pour la confiance dans l’économie numérique ↗
            </a>
            <a
              href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Informations de la CNIL sur les traceurs ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default MentionsLegales;
