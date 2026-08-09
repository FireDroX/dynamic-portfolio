import Seo from "./Seo";
import { useTranslation } from "react-i18next";

const ROUTE_SEO_KEYS = {
  "/": {
    title: "seo.homeTitle",
    description: "seo.homeDescription",
  },
  "/about": {
    title: "seo.aboutTitle",
    description: "seo.aboutDescription",
  },
  "/mentions-legales": {
    title: "seo.legalTitle",
    description: "seo.legalDescription",
  },
  "/achievements": {
    title: "seo.achievementsTitle",
    description: "seo.achievementsDescription",
    noIndex: true,
  },
};

const PANEL_SEO_KEYS = {
  title: "seo.panelTitle",
  description: "seo.panelDescription",
  noIndex: true,
};

const RouteSeo = ({ pathname }) => {
  const { t } = useTranslation();
  const seo = pathname.startsWith("/panel")
    ? PANEL_SEO_KEYS
    : ROUTE_SEO_KEYS[pathname];

  if (!seo) return null;

  return (
    <Seo
      title={t(seo.title)}
      description={t(seo.description)}
      noIndex={seo.noIndex}
      path={pathname}
    />
  );
};

export default RouteSeo;
