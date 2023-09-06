import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { UserDocument } from 'models/User';

class Room {
  @prop({ required: true, default: [] })
  public users!: string[];

  @prop()
  public locked?: boolean;

  public async addUser(this: RoomDocument, user: UserDocument) {
    this.users.push(user.id);
    await this.save();
  }

  public async removeUser(this: RoomDocument, user: UserDocument) {
    this.users = this.users.filter((id) => id !== user.id);
    await this.save();
  }
}

export type RoomDocument = DocumentType<Room>;
export const RoomModel = getModelForClass(Room);
