import { useEffect, useRef } from "react";

const TIMER_DURATION = 60 * 1000;

const useTimerAchievement = () => {
  const startTime = useRef(null);
  const timeout = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    startTime.current = Date.now();

    const checkElapsedTime = () => {
      if (hasTriggered.current) return;

      const elapsedTime = Date.now() - startTime.current;
      if (elapsedTime >= TIMER_DURATION) {
        hasTriggered.current = true;
        window.dispatchEvent(
          new CustomEvent("portfolio:very-interesting-portfolio"),
        );
        return;
      }

      timeout.current = setTimeout(
        checkElapsedTime,
        TIMER_DURATION - elapsedTime,
      );
    };

    checkElapsedTime();
    return () => clearTimeout(timeout.current);
  }, []);
};

export default useTimerAchievement;
