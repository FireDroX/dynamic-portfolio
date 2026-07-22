import "./App.css";
import { lazy, useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loadable from "./components/Loadable";
import Seo from "./components/Seo";
import { readNumber, writeNumber } from "./utils/storage";

// Lazy pages
const Home = lazy(() => import("./pages/Home"));
const Panel = lazy(() => import("./pages/Panel"));
const Projects = lazy(() => import("./pages/Projects"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Achievements = lazy(() => import("./pages/Achievements"));

const TIMER = 1 * 60 * 1000;

function useTimerAchievement() {
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const check = () => {
      if (triggeredRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed >= TIMER) {
        triggeredRef.current = true;

        window.dispatchEvent(
          new CustomEvent("portfolio:very-interesting-portfolio"),
        );
      } else {
        timeoutRef.current = setTimeout(check, TIMER - elapsed);
      }
    };

    check();

    return () => clearTimeout(timeoutRef.current);
  }, []);
}

function App() {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

  useTimerAchievement();

  // Vérification auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/panel/login/me", {
          credentials: "include",
        });
        const data = await res.json();
        setIsAuth(data.authenticated);
      } catch {
        setIsAuth(false);
      }
    };

    const visited = readNumber("portfolio_visited") + 1;
    writeNumber("portfolio_visited", visited);
    if (visited === 42) {
      window.dispatchEvent(new CustomEvent("portfolio:portfolio-enjoyer"));
    }

    checkAuth();
  }, []);

  const authLoader = (
    <main id="Loader" aria-label="Vérification de la session">
      <div className="spinner" />
    </main>
  );

  return (
    <>
      <Navbar />

      {location.pathname === "/" && (
        <Seo
          title="Adrien | Développeur React & Node.js"
          description="Portfolio d’Adrien, développeur web React et Node.js. Découvrez et testez ses projets interactifs directement en ligne."
          path="/"
        />
      )}
      {location.pathname === "/about" && (
        <Seo
          title="À propos d’Adrien | Développeur web"
          description="Découvrez le parcours, les compétences et les technologies d’Adrien, étudiant à l’ESGI et développeur React et Node.js."
          path="/about"
        />
      )}
      {location.pathname === "/mentions-legales" && (
        <Seo
          title="Mentions légales | Portfolio Adrien"
          description="Mentions légales et politique de confidentialité du portfolio d’Adrien."
          path="/mentions-legales"
        />
      )}
      {location.pathname === "/achievements" && (
        <Seo
          title="Secrets et achievements | Portfolio Adrien"
          description="Les secrets cachés dans le portfolio d’Adrien."
          path="/achievements"
          noIndex
        />
      )}
      {location.pathname.startsWith("/panel") && (
        <Seo
          title="Administration | Portfolio Adrien"
          description="Espace d’administration du portfolio."
          path={location.pathname}
          noIndex
        />
      )}

      <Routes location={location}>
        <Route path="/" element={Loadable(Home)} />

        <Route path="/projects" element={Loadable(Projects)} />
        <Route path="/projects/:project" element={Loadable(Projects)} />

        <Route
          path="/panel/login"
          element={
            isAuth === null ? (
              authLoader
            ) : isAuth ? (
              <Navigate to="/panel" replace />
            ) : (
              Loadable(Login, { onLogin: () => setIsAuth(true) })
            )
          }
        />

        <Route
          path="/panel/*"
          element={
            isAuth === null ? (
              authLoader
            ) : isAuth ? (
              Loadable(Panel, { onLogout: () => setIsAuth(false) })
            ) : (
              <Navigate to="/panel/login" replace />
            )
          }
        />

        <Route path="/about" element={Loadable(About)} />
        <Route path="/mentions-legales" element={Loadable(MentionsLegales)} />
        <Route path="/achievements" element={Loadable(Achievements)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <div
        id="achievement-popup-container"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      ></div>
    </>
  );
}

export default App;
