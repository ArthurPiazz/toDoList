import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/tasks'; 


Meteor.publish('tasks', function (showCompleted) {
  if (!this.userId) {
    return [];
  }

  let query = {
    $or: [
      { isPersonal: { $ne: true } },
      { owner: this.userId }
    ]
  };

  if (!showCompleted) {
    query = {
      $and: [
        query, 
        { status: { $ne: 'Concluída' } } 
      ]
    };
  }

  return TasksCollection.find(query);
});

Meteor.methods({
  async 'tasks.insert'(name, description, isPersonal) {
      if (!this.userId) throw new Meteor.Error('Não autorizado');

      const user = await Meteor.users.findOneAsync(this.userId);

      await TasksCollection.insertAsync({
        name,
        description,
        isPersonal: !!isPersonal, // Garante que seja um booleano
        status: 'Cadastrada',
        date: new Date(),
        owner: this.userId,
        creator: user.username,
      });
    },
  async 'tasks.remove'(taskId) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');
    
    const task = await TasksCollection.findOneAsync(taskId);
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'Apenas o criador pode excluir esta tarefa.');
    }

    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.update'(taskId, name, description) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');

    const task = await TasksCollection.findOneAsync(taskId);
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'Apenas o criador pode editar esta tarefa.');
    }

    await TasksCollection.updateAsync(taskId, { $set: { name, description } });
  },

  async 'tasks.updateStatus'(taskId, status) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');

    const task = await TasksCollection.findOneAsync(taskId);
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'Apenas o criador pode mudar o status desta tarefa.');
    }

    await TasksCollection.updateAsync(taskId, { $set: { status } });
  },
  async 'users.updateProfile'(profileData) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');

    await Meteor.users.updateAsync(this.userId, {
      $set: {
        profile: {
          name: profileData.name,
          email: profileData.email,
          birthDate: profileData.birthDate,
          gender: profileData.gender,
          company: profileData.company,
          photo: profileData.photo 
        }
      }
    });
  }
});

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'; // Importante para criar os usuários corretamente
import { TasksCollection } from '/imports/api/tasks';

// ... suas publicações (Meteor.publish) e métodos (Meteor.methods) continuam aqui em cima ...

Meteor.startup(async () => {
  // 1. HARD RESET: Limpa todas as tarefas E todos os usuários
  await TasksCollection.removeAsync({});
  await Meteor.users.removeAsync({});
  console.log('🧹 Banco de dados TOTALMENTE limpo (Tarefas e Usuários)!');

  // 2. Define os usuários de teste (Vamos usar a mesma senha para facilitar)
  const defaultPassword = 'password123';
  const usersToCreate = [
    { username: 'joao', profile: { name: 'João Silva', email: 'joao@teste.com' } },
    { username: 'maria', profile: { name: 'Maria Souza', email: 'maria@teste.com' } },
    { username: 'carlos', profile: { name: 'Carlos Santos', email: 'carlos@teste.com' } }
  ];

  const userIds = {};

  // Cria as contas no sistema e guarda os IDs gerados
  for (const u of usersToCreate) {
    const userId = await Accounts.createUserAsync({
      username: u.username,
      password: defaultPassword,
      profile: u.profile
    });
    userIds[u.username] = userId; // Salva o ID associado ao nome para usarmos nas tarefas
  }
  console.log('👥 3 Usuários de teste criados (joao, maria, carlos)!');

  // 3. Cria as tarefas espalhadas entre os usuários, misturando públicas e pessoais
  const mockTasks = [
    {
      name: 'Tarefa Pública do João',
      description: 'Todos podem ver esta tarefa, mas só o João pode editar.',
      status: 'Cadastrada',
      isPersonal: false,
      date: new Date(),
      owner: userIds['joao'],
      creator: 'joao',
    },
    {
      name: 'Segredo do João',
      description: 'Esta tarefa tem cadeado. Só o João pode ver no painel dele.',
      status: 'Em Andamento',
      isPersonal: true, // Pessoal
      date: new Date(),
      owner: userIds['joao'],
      creator: 'joao',
    },
    {
      name: 'Apresentação da Maria',
      description: 'Qualquer um da equipe pode acompanhar o status.',
      status: 'Concluída',
      isPersonal: false,
      date: new Date(Date.now() - 86400000), // Ontem
      owner: userIds['maria'],
      creator: 'maria',
    },
    {
      name: 'Anotações Médicas da Maria',
      description: 'Completamente invisível para o João e para o Carlos.',
      status: 'Cadastrada',
      isPersonal: true, // Pessoal
      date: new Date(),
      owner: userIds['maria'],
      creator: 'maria',
    },
    {
      name: 'Projeto de Infraestrutura (Carlos)',
      description: 'Carlos está liderando isso. Aberto para visualização.',
      status: 'Em Andamento',
      isPersonal: false,
      date: new Date(),
      owner: userIds['carlos'],
      creator: 'carlos',
    }
  ];

  // 4. Insere as tarefas no banco
  for (const task of mockTasks) {
    await TasksCollection.insertAsync(task);
  }

  console.log(`🌱 Banco populado com ${mockTasks.length} tarefas de exemplo!`);
  console.log('⚠️ DICA DE TESTE: Faça login com o username "joao", "maria" ou "carlos" e a senha "password123".');
});