import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Link } from "react-router-dom"; 

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password, (err) => {
      if (err) {
        setError(err.reason);
      }
    });
  };

  return (
    <form onSubmit={submit} className="login-form">
      <h2>Login</h2>

      {error && <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{error}</p>}

      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button type="submit">Log In</button>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.9rem" }}>
          Ainda não tem uma conta?{" "}
          <Link to="/signup" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  );
};