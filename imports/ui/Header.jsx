import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import MeteorLogo from "./meteor-logo.svg";
import { useNavigate } from 'react-router-dom';


export const Header = () => {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());

  const logout = () => {
    Meteor.logout();
  };

  return (
    <div className="header">
      <nav className="nav container">
        <div className="logo-container">
          <MeteorLogo className="logo" onClick={() => navigate('/')}/>
        </div>
        
        <h1 className="page-title">Welcome to Meteor!</h1>

        {user && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

            <button 
              className="button" 
              onClick={() => navigate('/profile')}
              style={{ backgroundColor: '#62807e' }}
            >
              Meu Perfil
            </button>
          <button 
            className="button" 
            onClick={logout}
            style={{ marginLeft: '1rem', backgroundColor: '#d9534f' }} 
          >
            Sair
          </button>
          </div>
        )}
      </nav>
    </div>
  );
};