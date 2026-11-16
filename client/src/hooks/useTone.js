import { useEffect } from "react";

const QUERY = "(prefers-color-scheme: light)";

export default function useTone() {
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const apply = () => {
      document.documentElement.dataset.tone = media.matches ? "light" : "dark";
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
}
