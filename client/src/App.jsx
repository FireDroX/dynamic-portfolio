import { useLocation } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToHash from "./components/ScrollToHash";
import RouteSeo from "./components/RouteSeo";
import useTone from "./hooks/useTone";
import usePanelAuth from "./hooks/usePanelAuth";
import useTimerAchievement from "./hooks/useTimerAchievement";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const location = useLocation();
  const { isAuthenticated, markAuthenticated, markLoggedOut } = usePanelAuth();

  useTone();
  useTimerAchievement();

  return (
    <>
      <Navbar />
      <ScrollToHash />
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
