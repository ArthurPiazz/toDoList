import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { TasksCollection } from '../api/tasks';

// Importações do Material-UI
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper, 
  CircularProgress,
  Stack
} from '@mui/material';

// Importações de Ícones
import ListAltIcon from '@mui/icons-material/ListAlt';

import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const HomePage = ({ user }) => {
  const navigate = useNavigate();

  const isLoading = useSubscribe('tasks');
  const tasks = useFind(() => TasksCollection.find());

  const stats = {
    cadastradas: tasks.filter(t => t.status === 'Cadastrada').length,
    emAndamento: tasks.filter(t => t.status === 'Em Andamento').length,
    concluidas: tasks.filter(t => t.status === 'Concluída').length,
    total: tasks.length
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10, p: 3 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Bem-vindo ao Meteor ToDo
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
          Organize suas tarefas de equipe e pessoais em um só lugar.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/login')}>
          Começar Agora
        </Button>
      </Box>
    );
  }

  if (isLoading()) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 4, maxWidth: 1000, margin: '0 auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Dashboard de Tarefas 
        </Typography>
        <Button 
          variant="contained" 
          endIcon={<ArrowForwardIcon />} 
          onClick={() => navigate('/team')}
        >
          Ver Lista Completa
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #757575', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ListAltIcon color="action" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" variant="overline">Cadastradas</Typography>
                  <Typography variant="h4" fontWeight="bold">{stats.cadastradas}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #ed6c02', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PlayCircleOutlinedIcon color="warning" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" variant="overline">Em Andamento</Typography>
                  <Typography variant="h4" fontWeight="bold">{stats.emAndamento}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #2e7d32', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleOutlinedIcon color="success" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" variant="overline">Concluídas</Typography>
                  <Typography variant="h4" fontWeight="bold">{stats.concluidas}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" color="textSecondary">
              Você tem um total de <strong>{stats.total}</strong> tarefas visíveis no momento.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};