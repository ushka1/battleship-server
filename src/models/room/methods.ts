import { Types } from 'mongoose';
import { IRoomMethods } from './Room';

export const addUser: IRoomMethods['addUser'] = async function (userId) {
  if (userId instanceof Types.ObjectId) {
    this.users.push(userId);
  } else {
    this.users.push(new Types.ObjectId(userId));
  }

  await this.save();
};

export const removeUser: IRoomMethods['removeUser'] = async function (userId) {
  this.users = this.users.filter((id) => id.equals(userId));
  if (this.users.length === 0) {
    await this.deleteOne();
    return;
  }

  await this.save();
};
