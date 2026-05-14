import React, { useState } from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../api/tasks';
import { useNavigate } from 'react-router-dom';

import { 
  Box, Typography, TextField, Button, List, ListItem, 
  ListItemIcon, ListItemText, Paper, Divider, CircularProgress,
  IconButton, ListItemSecondaryAction, Chip
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const TeamPage = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const navigate = useNavigate();

  const isLoading = useSubscribe('tasks');
  const tasks = useFind(() => TasksCollection.find({}, { sort: { date: -1 } }));

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    Meteor.call('tasks.insert', taskName, taskDesc, (err) => {
      if (!err) {
        setTaskName('');
        setTaskDesc('');
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
      Meteor.call('tasks.remove', id);
    }
  };

  if (isLoading()) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">Tarefas da Equipe</Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <TextField label="Nome da Tarefa" size="small" value={taskName} onChange={(e) => setTaskName(e.target.value)} required sx={{ flexGrow: 1 }} />
          <TextField label="Descrição" size="small" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} sx={{ flexGrow: 2 }} />
          <Button type="submit" variant="contained" startIcon={<AddTaskIcon />}>Adicionar</Button>
        </form>
      </Paper>

      <Paper elevation={2}>
        <List>
          {tasks.map((task, index) => (
            <React.Fragment key={task._id}>
              <ListItem>
                <ListItemIcon><AssignmentIcon color="primary" /></ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {task.name}
                      <Chip label={task.status} size="small" color={task.status === 'Concluída' ? 'success' : task.status === 'Em Andamento' ? 'warning' : 'default'} />
                    </Box>
                  }
                  secondary={`Criado por: ${task.creator} em ${new Date(task.date).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => navigate(`/task/${task._id}`)} color="primary"><EditIcon /></IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(task._id)} color="error"><DeleteIcon /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < tasks.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
          {tasks.length === 0 && <ListItem><ListItemText primary="Nenhuma tarefa." align="center" /></ListItem>}
        </List>
      </Paper>
    </Box>
  );
};