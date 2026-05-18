import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { 
  Box, Typography, TextField, Button, Paper, Stack, Divider, 
  Avatar, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export const ProfilePage = () => {

  const user = useTracker(() => Meteor.user());

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [company, setCompany] = useState('');
  const [photo, setPhoto] = useState('');

    useEffect(() => {
        
        if (user && user.profile && !isEditing) {
        setName(user.profile.name || '');
        setEmail(user.profile.email || '');
        setBirthDate(user.profile.birthDate || '');
        setGender(user.profile.gender || '');
        setCompany(user.profile.company || '');
        setPhoto(user.profile.photo || '');
        }
    }, [user, isEditing]); 

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const profileData = { name, email, birthDate, gender, company, photo };

    Meteor.call('users.updateProfile', profileData, (err) => {
      if (err) {
        alert('Erro ao atualizar perfil: ' + err.reason);
      } else {
        setIsEditing(false);
      }
    });
  };
  

  const handleCancel = () => {
    if (user && user.profile) {
      setName(user.profile.name || '');
      setEmail(user.profile.email || '');
      setBirthDate(user.profile.birthDate || '');
      setGender(user.profile.gender || '');
      setCompany(user.profile.company || '');
      setPhoto(user.profile.photo || '');
    }
    setIsEditing(false);
  };

  

  if (!user) return <Typography align="center" mt={5}>Carregando usuário...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={photo} 
            sx={{ width: 120, height: 120, mb: 2, boxShadow: 2 }}
          >
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          
          {isEditing && (
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={<PhotoCameraIcon />}
            >
              Alterar Foto
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </Button>
          )}
        </Box>

        {!isEditing ? (
          <Stack spacing={2} sx={{ textAlign: 'left' }}>
            <Typography variant="h5" align="center" color="primary" fontWeight="bold" gutterBottom>
              Meu Perfil
            </Typography>
            <Divider />
            <Typography variant="body1"><strong>Nome:</strong> {name || 'Não informado'}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {email || 'Não informado'}</Typography>
            <Typography variant="body1"><strong>Data de Nascimento:</strong> {birthDate ? new Date(birthDate).toLocaleDateString('pt-BR') : 'Não informada'}</Typography>
            <Typography variant="body1"><strong>Sexo:</strong> {gender || 'Não informado'}</Typography>
            <Typography variant="body1"><strong>Empresa:</strong> {company || 'Não informada'}</Typography>
            <Divider sx={{ my: 2 }} />
            <Button 
              variant="contained" 
              startIcon={<EditIcon />} 
              onClick={() => setIsEditing(true)}
              fullWidth
            >
              Editar Perfil
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSave}>
            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
              Editar Perfil
            </Typography>
            
            <Stack spacing={2.5}>
              <TextField 
                label="Nome" fullWidth size="small" required
                value={name} onChange={(e) => setName(e.target.value)} 
              />
              
              <TextField 
                label="Email" type="email" fullWidth size="small" required
                value={email} onChange={(e) => setEmail(e.target.value)} 
              />
              
                <TextField 
                label="Data de Nascimento" 
                type="date" 
                fullWidth 
                size="small" 
                required
                InputLabelProps={{ shrink: true }}
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                />

              <FormControl fullWidth size="small" required>
                <InputLabel id="gender-label">Sexo</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Sexo"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  sx={{ textAlign: 'left' }}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Outro">Outro</MenuItem>
                  <MenuItem value="Prefiro não dizer">Prefiro não dizer</MenuItem>
                </Select>
              </FormControl>

              <TextField 
                label="Empresa" fullWidth size="small"
                value={company} onChange={(e) => setCompany(e.target.value)} 
              />

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" startIcon={<SaveIcon />} type="submit" fullWidth>
                  Salvar
                </Button>
                <Button variant="outlined" color="error" onClick={handleCancel} fullWidth>
                    Cancelar
                </Button>
              </Stack>
            </Stack>
          </form>
        )}
      </Paper>
    </Box>
  );
};