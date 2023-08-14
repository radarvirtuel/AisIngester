import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AisLiveDocument = HydratedDocument<AisLive>;

@Schema({ collection: 'aisLive' })
export class AisLive {
  @Prop({ required: true, index: 1 })
  mmsi: number;

  @Prop({ required: true })
  cpt_pos: number;
  @Prop({ required: true, index: -1 })
  first_ts: Date;
  @Prop({ required: true, index: -1 })
  last_ts: Date;
  @Prop({
    required: false,
    type: [Number],
    index: '2d',
  })
  first_loc?: number[];
  @Prop({
    required: false,
    type: [Number],
    index: '2d',
  })
  last_loc?: number[];

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
  callsign?: string;
  @Prop()
  destination?: string;
  @Prop()
  draught?: number;
  @Prop()
  eta?: Date;
  @Prop()
  imo?: number;
  @Prop()
  ship_type?: number;
  @Prop()
  shipname?: string;

  @Prop()
  to_bow?: number;
  @Prop()
  to_port?: number;
  @Prop()
  to_starboard?: number;
  @Prop()
  to_stern?: number;
}

export const AisLiveSchema = SchemaFactory.createForClass(AisLive);
