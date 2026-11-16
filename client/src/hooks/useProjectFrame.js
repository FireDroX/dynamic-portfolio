import { useCallback, useEffect, useRef, useState } from "react";

const useProjectFrame = () => {
  const frameRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen] = useState(() => Boolean(document.fullscreenEnabled));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const sync = () =>
      setIsFullscreen(
        Boolean(frameRef.current) &&
          document.fullscreenElement === frameRef.current,
      );

    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const toggleFullscreen = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const request =
      document.fullscreenElement === frame
        ? document.exitFullscreen()
        : frame.requestFullscreen();
    Promise.resolve(request).catch(() => {});
  }, []);

  const toggleMobile = useCallback(() => setIsMobile((value) => !value), []);

  return {
    frameRef,
    reloadKey,
    reload,
    isFullscreen,
    canFullscreen,
    toggleFullscreen,
    isMobile,
    toggleMobile,
  };
};

export default useProjectFrame;
