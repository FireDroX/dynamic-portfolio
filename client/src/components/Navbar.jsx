import "./styles/Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split("/")[1];

  return (
    <nav className="nav-header">
      <div className="navbar">
        <p>portfolio</p>
        <div>
          <span
            className={path === "" ? "nav-active" : ""}
            onClick={() => navigate("/")}
          >
            home
          </span>
          <span
            className={path === "about" ? "nav-active" : ""}
            onClick={() => navigate("/about")}
          >
            about
          </span>
          <span
            className={path === "projects" ? "nav-active" : ""}
            onClick={() => navigate("/projects")}
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
