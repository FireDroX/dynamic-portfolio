import "./styles/Panel.css";
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
    <div className="App">
      <header>
        <small>portfolio</small>
        <h1>Panel</h1>
      </header>

      <div className="panel">
        <form
          className="panel-form"
          ethod="POST"
          action="/api/panel/add"
          enctype="multipart/form-data"
        >
          <input
            required
            type="text"
            name="name"
            placeholder="Nom du projet"
            className="panel-grid1"
          />

          <input
            required
            type="text"
            name="description"
            placeholder="Description"
            className="panel-grid2"
          />

          <label className="panel-upload panel-grid3">
            <div className="reader-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <div className="reader-txt">
              <span>Image</span>
            </div>
            <input type="file" name="image" accept="image/*" />
          </label>

          <label className="panel-upload panel-grid4">
            <div className="reader-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <div className="reader-txt">
              <span>Dossier .ZIP</span>
            </div>
            <input required type="file" name="zip" accept=".zip" />
          </label>

          <button className="panel-grid5">Ajouter le projet</button>
        </form>
      </div>

      <br />

      <div className="panel-projects">
        {projects
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((p) => (
            <div key={p.name} className="panel-project">
              <p className="panel-project-name">{p.name}</p>
              <p className="panel-project-description">{p.description}</p>
              <a
                className="panel-project-link"
                href={`/projects/${p.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
              <button onClick={() => handleDelete(p.name)}>Supprimer</button>
            </div>
          ))}
      </div>

      <button
        className="panel-logout"
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
    </div>
  );
};

export default Panel;
