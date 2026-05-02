import "./App.css";
import { lazy, useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loadable from "./components/Loadable";

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
  const startTimeRef = useRef(Date.now());
  const timeoutRef = useRef(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
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

    const visited =
      (parseInt(localStorage.getItem("portfolio_visited")) || 0) + 1;
    localStorage.setItem("portfolio_visited", visited);
    if (visited === 42) {
      window.dispatchEvent(new CustomEvent("portfolio:portfolio-enjoyer"));
    }

    checkAuth();
  }, []);

  // Loader global
  if (isAuth === null) return <div className="spinner" />;

  return (
    <>
      <Navbar />

      <Routes location={location}>
        <Route path="/" element={Loadable(Home)} />

        <Route path="/projects" element={Loadable(Projects)} />
        <Route path="/projects/:project" element={Loadable(Projects)} />

        <Route
          path="/panel/login"
          element={
            isAuth ? (
              <Navigate to="/panel" replace />
            ) : (
              Loadable(Login, { onLogin: () => setIsAuth(true) })
            )
          }
        />

        <Route
          path="/panel/*"
          element={
            isAuth ? (
              Loadable(Panel, { onLogout: () => setIsAuth(false) })
            ) : (
              <Navigate to="/panel/login" replace />
            )
          }
        />

        <Route path="/about" element={Loadable(About)} />
        <Route path="/mentions-legales" element={Loadable(MentionsLegales)} />
        <Route path="/achievements" element={Loadable(Achievements)} />
      </Routes>

      <Footer />
      <div id="achievement-popup-container"></div>
    </>
  );
}

export default App;
