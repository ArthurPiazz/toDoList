import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/tasks'; 


Meteor.publish('tasks', function () {
  return TasksCollection.find();
});


Meteor.methods({
  async 'tasks.insert'(name, description) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');

    const user = await Meteor.users.findOneAsync(this.userId);

    await TasksCollection.insertAsync({
      name,
      description,
      status: 'Cadastrada',
      date: new Date(),
      owner: this.userId,
      creator: user.username,
    });
  },

  async 'tasks.remove'(taskId) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');
    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.update'(taskId, name, description) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');
    await TasksCollection.updateAsync(taskId, { $set: { name, description } });
  },

  async 'tasks.updateStatus'(taskId, status) {
    if (!this.userId) throw new Meteor.Error('Não autorizado');
    await TasksCollection.updateAsync(taskId, { $set: { status } });
  }
});