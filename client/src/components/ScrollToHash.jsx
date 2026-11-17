import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

const MAX_FRAMES = 60;

// A stray "%" in a shared link must not crash the app: fall back to the raw id.
const decodeHash = (hash) => {
  const raw = hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const ScrollToHash = () => {
  const { pathname, search, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previous = useRef(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = { pathname, search };

    if (!hash) {
      // First load, reload, back and forward (all "POP"): the browser restores
      // the scroll position itself, so leave it alone.
      if (navigationType === "POP") return undefined;
      // Only the query changed on the same page (pagination, filters, search):
      // the page handles its own scroll, so stay where the visitor is.
      if (before && before.pathname === pathname && before.search !== search) {
        return undefined;
      }
      window.scrollTo(0, 0);
      return undefined;
    }

    const id = decodeHash(hash);
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
  }, [pathname, search, hash, key, navigationType]);

  return null;
};

export default ScrollToHash;
