import { Schema } from 'mongoose';

import { IUser, IUserMethods, UserModel } from './User';

export function setupUserMethods(
  schema: Schema<IUser, UserModel, IUserMethods>,
) {
  // schema.method('xyz', async function (this: IUser, board: Board) {
  //   await this.save();
  // });
}
