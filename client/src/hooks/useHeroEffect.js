import { useEffect } from "react";

const FX_URL = "/assets/effects/fx.js";
const EFFECT = "painterly-landscape";
const PARAMS = { calm: 0.7, calmX: 0.28, calmY: 0.5, grain: 0 };

// Mounts the kit's shader on a hero background layer. The kit draws its own CSS image
// when WebGL is missing and a still frame under prefers-reduced-motion.
const useHeroEffect = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    let fx = null;
    let api = null;
    const scheme = window.matchMedia("(prefers-color-scheme: light)");

    const syncPalette = () => {
      if (api && fx) api.setPalette(fx.readPalette(el));
    };

    // Absolute URL so Vite leaves the import alone: the kit lives in public/.
    const url = new URL(FX_URL, window.location.origin).href;
    import(/* @vite-ignore */ url)
      .then(async (module) => {
        fx = module.default;
        const mounted = await fx.mount(el, EFFECT, { params: PARAMS });
        if (cancelled) mounted.destroy();
        else api = mounted;
      })
      .catch(() => {});

    scheme.addEventListener("change", syncPalette);
    return () => {
      cancelled = true;
      scheme.removeEventListener("change", syncPalette);
      if (api) api.destroy();
    };
  }, [ref]);
};

export default useHeroEffect;
