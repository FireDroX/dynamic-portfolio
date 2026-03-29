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
        <p>Liste des projets créés.</p>
      </header>
      <section className="projects-grid">
        {projects.length === 0 ? (
          <Project
            p={{
              name: "No projects !",
              description: "(juste un template vide)",
              image:
                "data:image/png;base64,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",
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
