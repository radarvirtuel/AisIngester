import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AisLiveDocument = HydratedDocument<AisLive>;

@Schema({ collection: 'aisLiveTest' })
export class AisLive {
  @Prop({ required: true, index: 1 })
  mmsi: number;

  @Prop({ required: true })
  cptPos: number;
  @Prop({ required: true, index: -1 })
  firstTs: Date;
  @Prop({ required: true, index: -1 })
  lastTs: Date;
  @Prop({
    type: [Number],
    required: false,
    index: '2dsphere',
  })
  firstLoc?: number[];
  @Prop({
    type: [Number],
    required: false,
    index: '2dsphere',
  })
  lastLoc?: number[];

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

export const AisLiveSchema = SchemaFactory.createForClass(AisLive);
