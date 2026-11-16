import { useState } from "react";
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
  const isLoading = loadedKey !== reloadKey;

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
        title={project.fileName}
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
            onLoad={() => setLoadedKey(reloadKey)}
            allow="fullscreen"
          />
        </div>
      </AppFrame>
    </div>
  );
};

export default ProjectLivePreview;
