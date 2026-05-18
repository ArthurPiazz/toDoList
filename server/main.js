import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/tasks'; 


Meteor.publish('tasks', function () {
  if (!this.userId) {
      return [];
    }

    return TasksCollection.find({
      $or: [
        { isPersonal: { $ne: true } }, // Tarefas públicas (onde isPersonal não é true)
        { owner: this.userId }         // Tarefas que eu criei (pessoais ou não)
      ]
    });
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