import { useCallback, useEffect, useState } from "react";

const usePanelAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/panel/login/me", {
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  const markAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const markLoggedOut = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    markAuthenticated,
    markLoggedOut,
  };
};

export default usePanelAuth;
