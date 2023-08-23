import { Types } from 'mongoose';
import { IRoomMethods } from './Room';

export const addUser: IRoomMethods['addUser'] = async function (user) {
  this.users.push(new Types.ObjectId(user.id));
  await this.save();
};

export const removeUser: IRoomMethods['removeUser'] = async function (user) {
  this.users = this.users.filter((id) => !id.equals(user.id));
  await this.save();
};
