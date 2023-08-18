import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AisBrutDocument = HydratedDocument<AisBrut>;

@Schema({ collection: 'aisBrut' })
export class AisBrut {
  @Prop({ required: true, index: 1 })
  mmsi: number;

  @Prop({ required: true })
  messageType: number;

  @Prop({ required: true, index: 1 })
  stationId: number;

  @Prop({ required: true, index: -1 })
  timeStamp: Date;

  @Prop({
    required: false,
    type: [Number],
    index: '2d',
  })
  loc?: number[];

  @Prop()
  heading?: number;

  @Prop()
  accuracy?: boolean;

  @Prop()
  course?: number;

  @Prop()
  speed?: number;

  @Prop()
  maneuver?: number;

  @Prop()
  status?: number;

  @Prop()
  turn?: number;

  @Prop()
  callSign?: string;

  @Prop()
  destination?: string;

  @Prop()
  draught?: number;

  @Prop()
  eta?: Date;

  @Prop()
  imo?: number;

  @Prop()
  shipType?: number;

  @Prop()
  shipName?: string;

  @Prop()
  toBow?: number;
  @Prop()
  toPort?: number;
  @Prop()
  toStarboard?: number;
  @Prop()
  toStern?: number;
}

export const AisBrutSchema = SchemaFactory.createForClass(AisBrut);
