import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AisMessageDto } from './dto/ais-message.dto';
import { AisLive } from 'src/mongoose/schemas/aisLive.schema';
import { AisBrut } from 'src/mongoose/schemas/aisBrut.schema';

@Injectable()
export class AisService {
  constructor(
    @InjectModel(AisLive.name) private aisLiveModel: Model<AisLive>,
    @InjectModel(AisBrut.name) private aisBrutModel: Model<AisBrut>
  ) {}

  AIS_DYNAMIC_DATA = ['speed', 'heading', 'turn', 'course', 'maneuver', 'status', 'destination', 'accuracy'];
  AIS_STATIC_DATA = ['imo', 'callsign', 'ship_type', 'shipname', 'draught', 'to_bow', 'to_stern', 'to_port', 'to_starboard', 'vendorid', 'model', 'serial'];
  AIS_LIVE_DATA = [...this.AIS_DYNAMIC_DATA, ...this.AIS_STATIC_DATA, 'eta'];

  private async upsertLive(createMessageDto: AisMessageDto) {
    const { timestamp, loc, mmsi, ...newData } = createMessageDto;
    const filter = { mmsi: mmsi };
    const existingDocument = await this.aisLiveModel.findOne(filter).exec();

    const update = {
      $setOnInsert: { first_ts: new Date(timestamp) },
      $inc: { cpt_pos: 1 },
      $max: { last_ts: new Date(timestamp) },
      $set: {},
    };

    if (loc) update['$set']['last_loc'] = loc;

    if (!existingDocument || !existingDocument.first_loc) update['$set']['first_loc'] = loc;

    for (const prop of this.AIS_LIVE_DATA) {
      if (newData[prop]) update['$set'][prop] = newData[prop];
    }

    return this.aisLiveModel.updateOne(filter, update, {
      upsert: true,
    });
  }

  private insertBrut(createMessageDto: AisMessageDto) {
    return this.aisBrutModel.create(createMessageDto);
  }

  insertData(createMessageDto: AisMessageDto) {
    const operations = [this.insertBrut(createMessageDto), this.upsertLive(createMessageDto)];
    return Promise.all(operations);
  }
}
