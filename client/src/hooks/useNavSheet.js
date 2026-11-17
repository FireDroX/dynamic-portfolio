import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";

const DESKTOP = "(min-width: 1024px)";

export default function useNavSheet() {
  const { pathname, hash } = useLocation();
  // The sheet is open for one location only: navigating closes it.
  const where = pathname + hash;
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === where;

  const close = useCallback(() => setOpenAt(null), []);
  const toggle = useCallback(
    () => setOpenAt((current) => (current === where ? null : where)),
    [where],
  );

  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    return () => document.body.classList.remove("nav-locked");
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenAt(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP);
    const onChange = (event) => {
      if (event.matches) setOpenAt(null);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return { open, close, toggle };
}
