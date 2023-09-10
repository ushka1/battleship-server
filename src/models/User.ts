import { faker } from '@faker-js/faker';
import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { Ship } from 'models/Ship';

class User {
  @prop({
    required: true,
    minlength: 1,
    maxlength: 32,
    default: () => faker.internet.userName(),
  })
  public username!: string;

  @prop()
  public shipsSetting?: Ship[];

  @prop()
  public socketId?: string;

  @prop()
  public poolId?: string;

  @prop()
  public roomId?: string;

  /* ========================= HELPERS ========================= */

  public get isOnline() {
    return !!this.socketId;
  }

  public get inPool() {
    return !!this.poolId;
  }

  public get inRoom() {
    return !!this.roomId;
  }
}

export type UserDocument = DocumentType<User>;
export const UserModel = getModelForClass(User);
