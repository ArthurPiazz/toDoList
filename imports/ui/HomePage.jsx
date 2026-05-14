import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Counter } from "./Counter.jsx";
import { Info } from "./Info.jsx";

export const HomePage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <section style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2 className="section-title">Bem-vindo ao nosso App!</h2>
        
        {!user ? (
          <div>
            <p style={{ marginBottom: '1rem' }}>Você precisa entrar para acessar os recursos.</p>
            <button className="button" onClick={() => navigate('/login')}>
              Fazer Login
            </button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1rem' }}>Você está autenticado!</p>
            <button className="button" onClick={() => navigate('/team')}>
              Ir para o Dashboard da Equipe
            </button>
          </div>
        )}
      </section>


    </div>
  );
};