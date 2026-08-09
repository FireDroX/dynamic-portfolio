import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router";

import "./index.css";
import "./i18n";
import App from "./App";
import "./utils/achievements";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <App />
  </Router>,
);
