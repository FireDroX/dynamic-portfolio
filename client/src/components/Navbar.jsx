import "../styles/Navbar.css";
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
          <span onClick={() => navigate("/")}>home</span>
          <span
            onClick={() => navigate("/projects")}
            style={
              path === "projects" ? { textDecoration: "underline 1px" } : {}
            }
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
