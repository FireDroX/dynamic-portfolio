import "../styles/Login.css";
import { useState } from "react";

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/panel/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      credentials: "include",
    });

    if (res.ok) {
      onLogin();
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div className="App">
      <header>
        <small>portfolio</small>
        <h1>Login</h1>
      </header>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Connexion</button>
      </form>
    </div>
  );
};

export default Login;
