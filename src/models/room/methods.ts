import { Types } from 'mongoose';
import { IRoomMethods } from './Room';

export const addUser: IRoomMethods['addUser'] = async function (userId) {
  this.users.push(new Types.ObjectId(userId));
  await this.save();
};

export const removeUser: IRoomMethods['removeUser'] = async function (userId) {
  this.users = this.users.filter((id) => !id.equals(userId));
  await this.save();
};
