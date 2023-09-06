import { prop } from '@typegoose/typegoose';

export class Ship {
  @prop({ required: true })
  id!: string;

  @prop({ required: true })
  size!: number;

  @prop({ required: true })
  row!: number;

  @prop({ required: true })
  col!: number;

  @prop({ required: true, enum: ['h', 'v'] })
  orientation!: 'h' | 'v';
}
