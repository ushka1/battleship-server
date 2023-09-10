import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { UserDocument } from 'models/User';

type UserState = {
  revengeWilling?: boolean;
  revengeReady?: boolean;
  disconnected?: boolean;
};

class Room {
  @prop({ required: true, maxlength: 2, default: [] })
  public users!: string[];

  @prop({ default: {} })
  public usersState?: {
    [user: string]: UserState;
  };

  @prop()
  public gameId?: string;

  @prop()
  public disabled?: boolean;

  /* ========================= HELPERS ========================= */

  public get inGame(): boolean {
    return !!this.gameId;
  }

  public getRival(this: RoomDocument, user: UserDocument): string | undefined {
    const rival = this.users.find((id) => id !== user.id);
    return rival;
  }

  /* ========================= ADD / REMOVE ========================= */

  public addUser(this: RoomDocument, user: UserDocument) {
    this.users.push(user.id);
    this.usersState![user.id] = {};
  }

  public removeUser(this: RoomDocument, user: UserDocument) {
    this.users = this.users.filter((id) => id !== user.id);
    delete this.usersState![user.id];
  }

  /* ========================= USER STATE ========================= */

  public setUserRevengeWill(
    this: RoomDocument,
    user: UserDocument,
    value: boolean,
  ) {
    if (!this.usersState) this.usersState = {};
    if (!this.usersState[user.id]) this.usersState[user.id] = {};

    this.usersState[user.id].revengeWilling = value;
  }

  public setUserRevengeReady(
    this: RoomDocument,
    user: UserDocument,
    value: boolean,
  ) {
    if (!this.usersState) this.usersState = {};
    if (!this.usersState[user.id]) this.usersState[user.id] = {};

    this.usersState[user.id].revengeReady = value;
  }

  public setUserDisconnected(
    this: RoomDocument,
    user: UserDocument,
    value: boolean,
  ) {
    if (!this.usersState) this.usersState = {};
    if (!this.usersState[user.id]) this.usersState[user.id] = {};

    this.usersState[user.id].disconnected = value;
  }

  public getRevengeWillingCount(this: RoomDocument): number {
    return Object.values(this.usersState!).filter((s) => s.revengeWilling)
      .length;
  }

  public getRevengeReadyCount(this: RoomDocument): number {
    return Object.values(this.usersState!).filter((s) => s.revengeReady).length;
  }

  public getDisconnectedCount(this: RoomDocument): number {
    return Object.values(this.usersState!).filter((s) => s.disconnected).length;
  }
}

export type RoomDocument = DocumentType<Room>;
export const RoomModel = getModelForClass(Room);
