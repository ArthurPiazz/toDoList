import React, { useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../api/tasks';
import { useTracker } from 'meteor/react-meteor-data';
import { 
  Box, Typography, TextField, Button, Paper, CircularProgress, 
  Stack, Divider, IconButton, Chip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';

export const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoading = useSubscribe('tasks');
  const currentUserId = useTracker(() => Meteor.userId());
  const task = useFind(() => TasksCollection.find({ _id: id }))[0];
  const isOwner = task?.owner === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleStartEditing = () => {
    setEditName(task.name);
    setEditDesc(task.description);
    setIsEditing(true);
  };

  const handleSave = () => {
    Meteor.call('tasks.update', task._id, editName, editDesc, (err) => {
      if (!err) setIsEditing(false);
    });
  };

  const handleChangeStatus = (newStatus) => {
    Meteor.call('tasks.updateStatus', task._id, newStatus);
  };

  if (isLoading()) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (!task) return <Typography align="center" mt={5}>Tarefa não encontrada.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4, p: 2 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/team')} sx={{ mb: 2 }}>
        Voltar para a Lista
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        {!isEditing ? (
          // ================= modo de vis =================
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {task.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                {task.isPersonal && <Chip label="Pessoal" variant="outlined" size="small" icon={<LockIcon />} />}
                <Chip 
                  label={task.status} 
                  color={task.status === 'Concluída' ? 'success' : task.status === 'Em Andamento' ? 'warning' : 'default'} 
                />
              </Stack>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>{task.description || "Sem descrição."}</Typography>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="textSecondary">Criado por: {task.creator}</Typography>
            <Typography variant="body2" color="textSecondary">Data: {new Date(task.date).toLocaleString()}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>Mudar Situação:</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Button 
                disabled={!isOwner || task.status !== 'Cadastrada'} 
                onClick={() => handleChangeStatus('Em Andamento')}
              >
                Iniciar
              </Button> 
              <Button 
                disabled={!isOwner || task.status !== 'Em Andamento'} 
                onClick={() => handleChangeStatus('Concluída')}
              >
                Concluir
              </Button>
              <Button 
                disabled={!isOwner || task.status === 'Cadastrada'} 
                onClick={() => handleChangeStatus('Cadastrada')}
              >
                Reiniciar
              </Button>
            </Stack>

            {isOwner && (
              <Button variant="contained" startIcon={<EditIcon />} onClick={handleStartEditing} fullWidth>
                Editar Informações
              </Button>
            )}
          </>
        ) : (
          // ================= modo de edit =================
          <>
            <Typography variant="h6" gutterBottom>Editar Tarefa</Typography>
            <TextField 
              fullWidth label="Nome da Tarefa" value={editName} onChange={(e) => setEditName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField 
              fullWidth label="Descrição" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
              multiline rows={4} sx={{ mb: 3 }}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} fullWidth>
                Salvar
              </Button>
              <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} fullWidth>
                Cancelar
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
};