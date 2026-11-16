import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

const MAX_FRAMES = 60;

const ScrollToHash = () => {
  const { pathname, search, hash, key } = useLocation();
  const previous = useRef(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = { pathname, search };

    if (!hash) {
      // Only the query changed on the same page (pagination, filters, search):
      // the page handles its own scroll, so stay where the visitor is.
      if (before && before.pathname === pathname && before.search !== search) {
        return undefined;
      }
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
    // `key` changes on every navigation, even to an identical URL.
  }, [pathname, search, hash, key]);

  return null;
};

export default ScrollToHash;
