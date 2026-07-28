import Seo from "./Seo";

const ROUTE_SEO = {
  "/": {
    title: "Adrien | Développeur React & Node.js",
    description:
      "Adrien conçoit des applications web, des jeux et des expériences interactives avec React et Node.js. Découvrez ses projets directement en ligne.",
  },
  "/about": {
    title: "À propos d’Adrien | Développeur web",
    description:
      "Découvrez le parcours, la façon de travailler et la boîte à outils d’Adrien, étudiant à l’ESGI Paris et développeur web.",
  },
  "/mentions-legales": {
    title: "Mentions légales | Portfolio Adrien",
    description:
      "Mentions légales et politique de confidentialité du portfolio d’Adrien.",
  },
  "/achievements": {
    title: "Secrets et achievements | Portfolio Adrien",
    description: "Les secrets cachés dans le portfolio d’Adrien.",
    noIndex: true,
  },
};

const PANEL_SEO = {
  title: "Administration | Portfolio Adrien",
  description: "Espace d’administration du portfolio.",
  noIndex: true,
};

const RouteSeo = ({ pathname }) => {
  const seo = pathname.startsWith("/panel")
    ? PANEL_SEO
    : ROUTE_SEO[pathname];

  if (!seo) return null;

  return <Seo {...seo} path={pathname} />;
};

export default RouteSeo;
