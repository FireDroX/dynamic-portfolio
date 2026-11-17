import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router";

// Self-hosted fonts: no request to a third-party CDN when the site loads.
import "@fontsource-variable/urbanist/wght.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./i18n";
import App from "./App";
import "./utils/achievements";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <App />
  </Router>,
);
