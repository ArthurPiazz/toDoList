import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Link } from "react-router-dom";

export const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    Accounts.createUser({ username, password }, (err) => {
      if (err) {
        setError(err.reason); 
      }
    });
  };

  return (
    <form onSubmit={submit} className="login-form">
      <h2>Criar Conta</h2>
      
      {error && <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{error}</p>}

      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Escolha um Username"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Escolha uma Senha"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button type="submit">Cadastrar</button>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.9rem" }}>
          Já possui uma conta?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
            Faça Login
          </Link>
        </p>
      </div>
    </form>
  );
};