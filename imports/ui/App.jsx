import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Header } from "./Header.jsx";
import { LoginForm } from "./LoginForm.jsx";
import { TeamPage } from "./TeamPage.jsx";
import { HomePage } from "./HomePage.jsx"; 
import { SignupForm } from "./SignupForm.jsx";
import { TaskPage } from "./TaskPage.jsx";
import { ProfilePage } from "./ProfilePage.jsx";


export const App = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <BrowserRouter>
      <div className="page">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            
            <Route 
              path="/login" 
              element={user ? <Navigate to="/team" replace /> : <LoginForm />} 
            />

            <Route 
              path="/signup" 
              element={user ? <Navigate to="/team" replace /> : <SignupForm />} 
            />

            <Route 
              path="/team" 
              element={user ? <TeamPage /> : <Navigate to="/login" replace />} 
            />

            <Route 
              path="/task/:id" 
              element={user ? <TaskPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/profile" 
              element={user ? <ProfilePage /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};