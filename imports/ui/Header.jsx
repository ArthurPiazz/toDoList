import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import MeteorLogo from "./meteor-logo.svg";

import { 
  Drawer, 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  IconButton 
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export const Header = () => {
  const user = useTracker(() => Meteor.user());
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const logout = () => {
    Meteor.logout();
    setIsDrawerOpen(false); 
    navigate('/login');
  };

  return (
    <div className="header">
      <nav className="nav container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

          {user && (
            <IconButton 
              onClick={() => setIsDrawerOpen(true)} 
              color="primary" 
              edge="start"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <MeteorLogo className="logo" />
          </div>
        </div>
        
        <h1 className="page-title">Welcome to Meteor!</h1>

        {user && (
          <button 
            className="button" 
            onClick={logout}
            style={{ backgroundColor: '#d9534f' }}
          >
            Sair
          </button>
        )}
      </nav>

      <Drawer
        anchor="left" 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
      >

        <Box sx={{ width: 260 }} role="presentation">

          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            backgroundColor: 'var(--color-background)',
            borderBottom: '1px solid var(--color-border)'
          }}>
            <Avatar 
              src={user?.profile?.photo} 
              sx={{ width: 70, height: 70, mb: 1.5, boxShadow: 2 }}
            >
              {user?.profile?.name ? user.profile.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.profile?.name || user?.username || 'Usuário'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
              {user?.profile?.email || 'Sem email cadastrado'}
            </Typography>
          </Box>

          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/team'); setIsDrawerOpen(false); }}>
                <ListItemIcon>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Lista de Tarefas" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/profile'); setIsDrawerOpen(false); }}>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Meu Perfil" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <ExitToAppIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Sair da Conta" primaryTypographyProps={{ color: 'error' }} />
              </ListItemButton>
            </ListItem>
          </List>

        </Box>
      </Drawer>
    </div>
  );
};