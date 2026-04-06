import "./styles/Projects.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Project from "../components/Project";

const Projects = () => {
  const { project } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/projects", { credentials: "include" });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [project]);

  if (loading) return <p>Loading...</p>;

  // TODO:
  if (project) {
    const isKnownProject = Array.from(projects.map((p) => p.fileName)).includes(
      project,
    );

    if (!isKnownProject) return navigate("/projects");

    return (
      <div className="App">
        <iframe
          src={`/api/projects/${project}`}
          title={project}
          style={{
            width: "100%",
            height: "80vh",
            backgroundColor: "transparent",
          }}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <small>portfolio</small>
        <h1>Projects</h1>
        <p>
          Liste des <strong>projets</strong> créés.
        </p>
      </header>
      <section className="projects-grid">
        {projects.length === 0 ? (
          <Project
            p={{
              name: "No projects !",
              description: "(juste un template vide)",
            }}
          />
        ) : (
          projects
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((p) => <Project p={p} />)
        )}
      </section>
    </div>
  );
};

export default Projects;
