import "./App.css";
import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Panel = lazy(() => import("./pages/Panel"));
const Projects = lazy(() => import("./pages/Projects"));
const Login = lazy(() => import("./pages/Login"));

const Loader = () => (
  <section className="App">
    <div className="spinner-container">
      <div className="spinner" aria-hidden="true"></div>
    </div>
  </section>
);

// Wrapper pour lazy load
const Loadable = (Component, props = {}) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

function App() {
  const [isAuth, setIsAuth] = useState(false);

  // Vérifie si connecté
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

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuth === null) return <Loader />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={Loadable(Home)} />
        <Route path="/projects" element={Loadable(Projects)} />
        <Route path="/projects/:project" element={Loadable(Projects)} />

        {/* Login page */}
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

        {/* Panel page */}
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
