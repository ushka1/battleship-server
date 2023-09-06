import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { UserDocument } from 'models/User';

class Room {
  @prop({ required: true, maxlength: 2, default: [] })
  public users!: string[];

  @prop()
  public gameId?: string;

  @prop({ default: { willing: [], ready: [] } })
  public revenge?: {
    willing: string[];
    ready: string[];
  };

  public getRival(this: RoomDocument, user: UserDocument): string | undefined {
    const rival = this.users.find((id) => id !== user.id);
    return rival!;
  }

  public markRevengeWill(this: RoomDocument, user: UserDocument) {
    if (this.revenge!.willing.includes(user.id)) return;
    this.revenge!.willing.push(user.id);
  }

  public markRevengeReady(this: RoomDocument, user: UserDocument) {
    if (this.revenge!.ready.includes(user.id)) return;
    this.revenge!.ready.push(user.id);
  }

  public clearRevenge(this: RoomDocument) {
    this.revenge!.willing = [];
    this.revenge!.ready = [];
  }

  /* ========================= TO REMOVE ========================= */

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
