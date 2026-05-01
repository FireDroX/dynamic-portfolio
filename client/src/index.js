import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

import "./utils/achievements_setup";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>,
);