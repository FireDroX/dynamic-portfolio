import { useEffect, useState } from "react";

const Panel = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await fetch("/api/panel", {
      credentials: "include",
    });

    if (res.status === 401) {
      onLogout();
      return;
    }

    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (name) => {
    await fetch("/api/panel/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
      credentials: "include",
    });

    fetchProjects();
  };

  return (
    <div>
      <h1>Panel</h1>

      <form method="POST" action="/api/panel/add" enctype="multipart/form-data">
        <input
          required
          name="name"
          placeholder="Nom du projet (peut contenir des espaces)"
        />

        <input required name="description" placeholder="Description" />
        <label>Image :</label>

        <input type="file" name="image" accept="image/*" />
        <label>Dossier ZIP :</label>

        <input required type="file" name="zip" accept=".zip" />
        <button>Ajouter</button>
      </form>

      <button
        onClick={async () => {
          await fetch("/api/panel/login/logout", {
            method: "POST",
            credentials: "include",
          });
          onLogout();
        }}
      >
        Logout
      </button>

      {projects.map((p) => (
        <div key={p.name}>
          <b>{p.name}</b>
          <br />
          <a href={`/projects/${p.fileName}`}>Voir</a>
          <br />
          <button onClick={() => handleDelete(p.name)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
};

export default Panel;
