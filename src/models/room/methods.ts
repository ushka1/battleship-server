import { IRoomMethods } from './Room';

export const addUser: IRoomMethods['addUser'] = async function (user) {
  this.users.push(user.id);
  await this.save();
};

export const removeUser: IRoomMethods['removeUser'] = async function (user) {
  this.users = this.users.filter((userId) => userId.equals(user.id));
  if (this.users.length === 0) {
    await this.deleteOne();
    return;
  }

  await this.save();
};
