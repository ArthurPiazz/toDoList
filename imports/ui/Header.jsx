import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import MeteorLogo from "./meteor-logo.svg";

export const Header = () => {

  const user = useTracker(() => Meteor.user());

  const logout = () => {
    Meteor.logout();
  };

  return (
    <div className="header">
      <nav className="nav container">
        <div className="logo-container">
          <MeteorLogo className="logo" />
        </div>
        
        <h1 className="page-title">Welcome to Meteor!</h1>

        {user && (
          <button 
            className="button" 
            onClick={logout}
            style={{ marginLeft: '1rem', backgroundColor: '#d9534f' }} 
          >
            Sair
          </button>
        )}
      </nav>
    </div>
  );
};