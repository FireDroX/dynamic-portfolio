import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Projects = () => {
  const { project } = useParams(); // undefined si /projects/
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (project) {
          setProjects([]); // Reset
        } else {
          const res = await fetch("/api/projects", { credentials: "include" });
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [project]);

  if (loading) return <p>Loading...</p>;

  if (project) {
    // Affiche un projet spécifique dans un iframe
    return (
      <section className="App">
        <h1>{project}</h1>
        <iframe
          src={`/api/projects/${project}`}
          title={project}
          style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}
        />
      </section>
    );
  }

  return (
    <section className="App">
      <h1>Projects</h1>
      <div>
        {projects.length === 0 && <p>Aucun projet trouvé.</p>}
        {projects.map((p) => (
          <div key={p.fileName} style={{ marginBottom: "20px" }}>
            <b>{p.name}</b>
            <p>{p.description}</p>
            {p.image && (
              <img
                src={`data:image/png;base64,${p.image}`}
                alt={p.name}
                style={{
                  maxWidth: "200px",
                  display: "block",
                  marginBottom: "5px",
                }}
              />
            )}
            <a
              href={`/projects/${p.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir le projet
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
