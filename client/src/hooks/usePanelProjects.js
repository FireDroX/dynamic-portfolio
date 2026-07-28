import { useCallback, useEffect, useState } from "react";

const usePanelProjects = (onLogout) => {
  const [projects, setProjects] = useState([]);
  const [editedProjects, setEditedProjects] = useState({});
  const [openPreviews, setOpenPreviews] = useState({});
  const [previewVersions, setPreviewVersions] = useState({});
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/panel", {
        credentials: "include",
      });

      if (response.status === 401) {
        onLogout();
        return;
      }
      if (!response.ok) throw new Error("Chargement impossible");

      setProjects(await response.json());
    } catch {
      setNotice({
        type: "error",
        text: "Impossible de charger les projets.",
      });
    }
  }, [onLogout]);

  useEffect(() => {
    // Initial synchronization with the administration API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [fetchProjects]);

  const changeProject = (fileName, field, value) => {
    setEditedProjects((previous) => ({
      ...previous,
      [fileName]: { ...previous[fileName], [field]: value },
    }));
  };

  const changeProjectFile = (fileName, field, file) => {
    if (!file) return;

    setEditedProjects((previous) => {
      const current = previous[fileName] || {};
      if (field === "image" && current.imagePreview) {
        URL.revokeObjectURL(current.imagePreview);
      }

      return {
        ...previous,
        [fileName]: {
          ...current,
          [field]: file,
          ...(field === "image"
            ? { imagePreview: URL.createObjectURL(file) }
            : {}),
        },
      };
    });
  };

  const saveProject = async (project) => {
    const updated = editedProjects[project.fileName];
    if (!updated) return;

    const formData = new FormData();
    formData.append("originalFileName", project.fileName);
    formData.append("name", updated.name ?? project.name);
    formData.append(
      "description",
      updated.description ?? project.description,
    );
    if (updated.image) formData.append("image", updated.image);
    if (updated.zip) formData.append("zip", updated.zip);

    setSaving(project.fileName);
    setNotice(null);

    try {
      const response = await fetch("/api/panel/modify", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Modification impossible");
      }

      if (updated.imagePreview) {
        URL.revokeObjectURL(updated.imagePreview);
      }
      setEditedProjects((previous) => {
        const nextProjects = { ...previous };
        delete nextProjects[project.fileName];
        return nextProjects;
      });
      setPreviewVersions((previous) => ({
        ...previous,
        [project.fileName]: Date.now(),
      }));
      setNotice({
        type: "success",
        text: `${project.name} a bien été mis à jour.`,
      });
      await fetchProjects();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving("");
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Supprimer définitivement « ${project.name} » ?`)) {
      return;
    }

    try {
      const response = await fetch("/api/panel/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: project.name }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("La suppression a échoué.");

      setNotice({
        type: "success",
        text: `${project.name} a été supprimé.`,
      });
      await fetchProjects();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  };

  const addProject = async (formData) => {
    setSaving("new");
    setNotice(null);

    try {
      const response = await fetch("/api/panel/add", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Impossible d'ajouter le projet.");
      }

      setNotice({
        type: "success",
        text: "Le projet a bien été ajouté.",
      });
      await fetchProjects();
      return true;
    } catch (error) {
      setNotice({ type: "error", text: error.message });
      return false;
    } finally {
      setSaving("");
    }
  };

  const togglePreview = (fileName) => {
    setOpenPreviews((previous) => ({
      ...previous,
      [fileName]: !previous[fileName],
    }));
  };

  return {
    projects,
    editedProjects,
    openPreviews,
    previewVersions,
    saving,
    notice,
    addProject,
    changeProject,
    changeProjectFile,
    deleteProject,
    dismissNotice: () => setNotice(null),
    saveProject,
    togglePreview,
  };
};

export default usePanelProjects;
