import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  typeof window.matchMedia !== "function" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOut = (progress) => 1 - (1 - progress) ** 3;

// Renders the final figure (what the HTML holds) and replays 0 -> target from
// the first frame, unless motion is reduced or there is nothing to count.
const useCountUp = (target, { duration = 1000 } = {}) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (target <= 0 || prefersReducedMotion()) return undefined;

    let frame;
    let start;
    const step = (now) => {
      start ??= now;
      const elapsed = Math.min((now - start) / duration, 1);
      setProgress(elapsed);
      if (elapsed < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return progress === null
    ? target
    : Math.round(target * easeOut(progress));
};

export default useCountUp;
