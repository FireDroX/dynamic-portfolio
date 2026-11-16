import "./styles/NotFound.css";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import AppFrame from "../components/ui/AppFrame";
import Button from "../components/ui/Button";
import Section from "../components/ui/Section";

const NotFound = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portfolio:lost-page"));
  }, []);

  return (
    <main className="notfound">
      <Seo
        title={t("seo.notFoundTitle")}
        description={t("seo.notFoundDescription")}
        noIndex
        path={pathname}
      />
      <Section className="hero notfound__hero" data-enter>
        <div className="hero-text hero-copy">
          <p className="notfound__eyebrow">{t("notFound.eyebrow")}</p>
          <h1>{t("notFound.title")}</h1>
          <p className="notfound__lead">{t("notFound.lead")}</p>

          <div className="notfound__terminal-wrap" data-ui>
            <AppFrame
              className="notfound__terminal"
              title={t("notFound.terminalTitle")}
            >
              <p className="notfound__line">
                <span className="notfound__prompt">$</span> cd {pathname}
              </p>
              <p className="notfound__line">
                <span className="notfound__error">command not found:</span>{" "}
                <span className="notfound__path">{pathname}</span>
              </p>
              <p className="notfound__line notfound__suggest">
                {t("notFound.suggest")}
              </p>
              <p className="notfound__line">
                <span className="notfound__prompt">$</span>{" "}
                <Link to="/" className="notfound__cmd">cd /</Link>
              </p>
              <p className="notfound__line">
                <span className="notfound__prompt">$</span>{" "}
                <Link to="/projects" className="notfound__cmd">cd /projects</Link>
              </p>
            </AppFrame>
          </div>

          <div className="btn-row">
            <Button variant="primary" to="/">
              {t("notFound.home")}
            </Button>
            <Button variant="secondary" to="/projects">
              {t("notFound.projects")}
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default NotFound;
