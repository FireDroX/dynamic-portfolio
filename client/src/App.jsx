import "./App.css";
import { useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RouteSeo from "./components/RouteSeo";
import usePanelAuth from "./hooks/usePanelAuth";
import useTimerAchievement from "./hooks/useTimerAchievement";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const location = useLocation();
  const {
    isAuthenticated,
    markAuthenticated,
    markLoggedOut,
  } = usePanelAuth();

  useTimerAchievement();

  return (
    <>
      <Navbar />
      <RouteSeo pathname={location.pathname} />
      <AppRoutes
        location={location}
        isAuthenticated={isAuthenticated}
        onLogin={markAuthenticated}
        onLogout={markLoggedOut}
      />
      <Footer />
      <div
        id="achievement-popup-container"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </>
  );
};

export default App;
