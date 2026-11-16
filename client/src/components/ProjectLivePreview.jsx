import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMaximize, FiMinimize, FiMonitor, FiRotateCw, FiSmartphone } from "react-icons/fi";

import AppFrame from "./ui/AppFrame";
import useProjectFrame from "../hooks/useProjectFrame";
import "./styles/ProjectLivePreview.css";

const ProjectLivePreview = ({ project }) => {
  const { t } = useTranslation();
  const {
    frameRef,
    reloadKey,
    reload,
    isFullscreen,
    canFullscreen,
    toggleFullscreen,
    isMobile,
    toggleMobile,
  } = useProjectFrame();
  const [loadedKey, setLoadedKey] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const isLoading = loadedKey !== reloadKey;

  // Focus moves into the iframe's document at once, so the iframe element never
  // matches :focus: the parent window losing focus to it is the only signal
  useEffect(() => {
    const iframe = frameRef.current?.querySelector("iframe");
    if (!iframe) return undefined;
    const onBlur = () => setIsFocused(document.activeElement === iframe);
    const onFocus = () => setIsFocused(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [frameRef, reloadKey]);

  const fullscreenLabel = t(
    isFullscreen ? "project.exitFullscreen" : "project.enterFullscreen",
  );
  const mobileLabel = t(isMobile ? "project.desktopView" : "project.mobileView");

  const actions = (
    <>
      <button
        type="button"
        className="project-frame__btn"
        onClick={reload}
        aria-label={t("project.reload")}
        title={t("project.reload")}
      >
        <FiRotateCw aria-hidden="true" />
      </button>
      <button
        type="button"
        className="project-frame__btn"
        onClick={toggleFullscreen}
        disabled={!canFullscreen}
        aria-pressed={isFullscreen}
        aria-label={fullscreenLabel}
        title={fullscreenLabel}
      >
        {isFullscreen ? <FiMinimize aria-hidden="true" /> : <FiMaximize aria-hidden="true" />}
      </button>
      <button
        type="button"
        className="project-frame__btn"
        onClick={toggleMobile}
        aria-pressed={isMobile}
        aria-label={mobileLabel}
        title={mobileLabel}
      >
        {isMobile ? <FiMonitor aria-hidden="true" /> : <FiSmartphone aria-hidden="true" />}
      </button>
    </>
  );

  return (
    <div
      ref={frameRef}
      className={`project-frame${isMobile ? " is-mobile" : ""}${isFullscreen ? " is-fullscreen" : ""}`}
    >
      <AppFrame
        title=""
        actions={actions}
        bodyClassName="project-frame__body"
      >
        <div className="project-frame__viewport">
          {isLoading && (
            <div className="project-frame__loader">
              <div className="spinner" />
              <p>{t("project.opening")}</p>
            </div>
          )}
          <iframe
            key={reloadKey}
            src={`/api/projects/${project.fileName}`}
            title={t("project.iframeTitle", { name: project.name })}
            className={isFocused ? "is-focused" : undefined}
            onLoad={() => setLoadedKey(reloadKey)}
            allow="fullscreen"
          />
        </div>
      </AppFrame>
    </div>
  );
};

export default ProjectLivePreview;
