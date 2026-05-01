import "./styles/Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split("/")[1];

  const handleClick = (path) => {
    navigate(path);

    const page = path.split("/")[1] || "home";
    const explorer = JSON.parse(
      localStorage.getItem("portfolio_explorer") || "{}",
    );
    explorer[page] = true;
    localStorage.setItem("portfolio_explorer", JSON.stringify(explorer));

    if (explorer.home && explorer.about && explorer.projects) {
      window.dispatchEvent(new CustomEvent("portfolio:explorer"));
    }
  };

  return (
    <nav className="nav-header">
      <div className="navbar">
        <p>portfolio</p>
        <div>
          <span
            className={path === "" ? "nav-active" : ""}
            onClick={() => handleClick("/")}
          >
            home
          </span>
          <span
            className={path === "about" ? "nav-active" : ""}
            onClick={() => handleClick("/about")}
          >
            about
          </span>
          <span
            className={path === "projects" ? "nav-active" : ""}
            onClick={() => handleClick("/projects")}
          >
            projects
          </span>
        </div>
        <button onClick={() => navigate("/panel")}>login</button>
      </div>
    </nav>
  );
};

export default Navbar;
