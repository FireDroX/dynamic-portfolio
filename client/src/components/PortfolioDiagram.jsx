import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const DIAGRAM_URL = "/assets/diagrams/diagram.js";

const buildSpec = (t) => ({
  layout: "free",
  alt: t("about.diagramAlt"),
  nodes: [
    { id: "zip", label: t("about.diagramZip"), icon: "ui:upload", at: [0.09, 0.5], atCompact: [0.5, 0.1] },
    { id: "express", label: t("about.diagramExpress"), icon: "si-express", at: [0.3, 0.5], atCompact: [0.5, 0.3] },
    { id: "mysql", label: t("about.diagramMysql"), icon: "si-mysql", at: [0.52, 0.2], atCompact: [0.25, 0.5] },
    { id: "disk", label: t("about.diagramDisk"), icon: "ui:hard-drive", at: [0.52, 0.8], atCompact: [0.75, 0.5] },
    { id: "iframe", label: t("about.diagramIframe"), icon: "ui:app-window", at: [0.74, 0.5], atCompact: [0.5, 0.7] },
    { id: "achievement", label: t("about.diagramAchievement"), icon: "ui:trophy", done: true, at: [0.92, 0.5], atCompact: [0.5, 0.9] },
  ],
  edges: [
    { from: "zip", to: "express" },
    { from: "express", to: "mysql", curve: "elbow" },
    { from: "express", to: "disk", curve: "elbow" },
    { from: "mysql", to: "iframe", curve: "elbow" },
    { from: "disk", to: "iframe", curve: "elbow" },
    { from: "iframe", to: "achievement" },
  ],
});

const PortfolioDiagram = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    let diagram = null;

    // Absolute URL so Vite leaves the import alone: the kit lives in public/.
    const url = new URL(DIAGRAM_URL, window.location.origin).href;
    import(/* @vite-ignore */ url)
      .then(({ default: dg }) => {
        if (!cancelled) diagram = dg.mount(el, buildSpec(t));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (diagram) diagram.destroy();
    };
    // Redrawn when the language changes: the labels are baked into the SVG.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.resolvedLanguage]);

  return <div ref={ref} className="dg" />;
};

export default PortfolioDiagram;
