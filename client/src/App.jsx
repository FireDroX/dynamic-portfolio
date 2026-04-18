import "./App.css";
import { lazy, useState, useEffect } from "react";
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

function App() {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

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
      </Routes>

      <Footer />
    </>
  );
}

export default App;
