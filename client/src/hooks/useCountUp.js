import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  typeof window.matchMedia !== "function" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOut = (progress) => 1 - (1 - progress) ** 3;

// Counts 0 -> target, starting at 0 on the very first render so the final
// figure never flashes before the animation. Under reduced motion, or with
// nothing to count, the target is returned as is.
const useCountUp = (target, { duration = 1000 } = {}) => {
  // Progress is tied to the target it was measured for: a new target starts
  // again from 0 instead of showing its final value for a frame.
  const [state, setState] = useState(null);
  const animate = target > 0 && !prefersReducedMotion();

  useEffect(() => {
    if (!animate) return undefined;

    let frame;
    let start;
    const step = (now) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      setState({ target, progress });
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [animate, target, duration]);

  if (!animate) return target;
  if (state?.target !== target) return 0;
  return Math.round(target * easeOut(state.progress));
};

export default useCountUp;
