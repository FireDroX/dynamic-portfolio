import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import Loadable from "../components/Loadable";

const Home = lazy(() => import("../pages/Home"));
const Panel = lazy(() => import("../pages/Panel"));
const Projects = lazy(() => import("../pages/Projects"));
const ProjectDetail = lazy(() => import("../pages/ProjectDetail"));
const Login = lazy(() => import("../pages/Login"));
const About = lazy(() => import("../pages/About"));
const MentionsLegales = lazy(() => import("../pages/MentionsLegales"));
const Achievements = lazy(() => import("../pages/Achievements"));

const AuthLoader = () => (
  <main id="Loader" aria-label="Vérification de la session">
    <div className="spinner" />
  </main>
);

const PanelLoginRoute = ({ isAuthenticated, onLogin }) => {
  if (isAuthenticated === null) return <AuthLoader />;
  if (isAuthenticated) return <Navigate to="/panel" replace />;

  return Loadable(Login, { onLogin });
};

const ProtectedPanelRoute = ({ isAuthenticated, onLogout }) => {
  if (isAuthenticated === null) return <AuthLoader />;
  if (!isAuthenticated) return <Navigate to="/panel/login" replace />;

  return Loadable(Panel, { onLogout });
};

const AppRoutes = ({
  location,
  isAuthenticated,
  onLogin,
  onLogout,
}) => (
  <Routes location={location}>
    <Route path="/" element={Loadable(Home)} />
    <Route path="/projects" element={Loadable(Projects)} />
    <Route path="/projects/:project" element={Loadable(ProjectDetail)} />
    <Route
      path="/panel/login"
      element={
        <PanelLoginRoute
          isAuthenticated={isAuthenticated}
          onLogin={onLogin}
        />
      }
    />
    <Route
      path="/panel/*"
      element={
        <ProtectedPanelRoute
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
        />
      }
    />
    <Route path="/about" element={Loadable(About)} />
    <Route path="/mentions-legales" element={Loadable(MentionsLegales)} />
    <Route path="/achievements" element={Loadable(Achievements)} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
