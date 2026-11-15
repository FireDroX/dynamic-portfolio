import { useEffect } from "react";
import { useLocation } from "react-router";

const MAX_FRAMES = 60;

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let raf;

    // Pages are lazy: the target may not be in the DOM yet.
    const seek = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView();
      } else if (frame++ < MAX_FRAMES) {
        raf = requestAnimationFrame(seek);
      }
    };
    seek();

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
