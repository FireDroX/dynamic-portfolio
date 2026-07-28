import { useEffect, useState } from "react";

const INITIAL_REQUEST = {
  slug: null,
  project: null,
  hasError: false,
};

const useProjectDetails = (projectSlug) => {
  const [request, setRequest] = useState(INITIAL_REQUEST);

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      try {
        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectSlug)}/meta`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error(String(response.status));

        setRequest({
          slug: projectSlug,
          project: await response.json(),
          hasError: false,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setRequest({
            slug: projectSlug,
            project: null,
            hasError: true,
          });
        }
      }
    };

    loadProject();
    return () => controller.abort();
  }, [projectSlug]);

  useEffect(() => {
    if (request.project?.fileName !== projectSlug) return;

    window.dispatchEvent(
      new CustomEvent("portfolio:project-viewed", {
        detail: { fileName: request.project.fileName },
      }),
    );
  }, [projectSlug, request.project]);

  return {
    project: request.project,
    hasError: request.hasError,
    isLoading: request.slug !== projectSlug,
  };
};

export default useProjectDetails;
