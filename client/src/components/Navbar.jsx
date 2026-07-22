import "./styles/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { readObject, writeJson } from "../utils/storage";

const Navbar = () => {
  const navigate = useNavigate();

  const trackPage = (page) => {
    const explorer = readObject("portfolio_explorer");
    explorer[page] = true;
    writeJson("portfolio_explorer", explorer);

    if (explorer.home && explorer.about && explorer.projects) {
      window.dispatchEvent(new CustomEvent("portfolio:explorer"));
    }
  };

  return (
    <nav className="nav-header">
      <div className="navbar">
        <p>portfolio</p>
        <div>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-active" : "")}
            onClick={() => trackPage("home")}
          >
            home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
            onClick={() => trackPage("about")}
          >
            about
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
            onClick={() => trackPage("projects")}
          >
            projects
          </NavLink>
        </div>
        <button onClick={() => navigate("/panel")}>login</button>
      </div>
    </nav>
  );
};

export default Navbar;
