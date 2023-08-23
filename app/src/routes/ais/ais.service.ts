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
  AIS_STATIC_DATA = ['imo', 'callSign', 'shipType', 'shipName', 'draught', 'toBow', 'toStern', 'toPort', 'toStarboard'];
  AIS_LIVE_DATA = [...this.AIS_DYNAMIC_DATA, ...this.AIS_STATIC_DATA, 'eta'];

  private async upsertLive(createMessageDto: AisMessageDto) {
    const message = { ...createMessageDto };
    const { timeStamp, loc, mmsi, ...newData } = message;
    const filter = { mmsi: mmsi };
    const existingDocument = await this.aisLiveModel.findOne(filter).exec();
    const update = {
      $setOnInsert: { firstTs: new Date(timeStamp) },
      $inc: { cptPos: 1 },
      $max: { lastTs: new Date(timeStamp) },
      $set: {},
    };
    //
    if (loc) {
      const reversedLoc = loc.reverse();
      update['$set']['lastLoc'] = reversedLoc;

      if (!existingDocument || !existingDocument.firstLoc) {
        update['$set']['firstLoc'] = reversedLoc;
      }
    }

    for (const prop of this.AIS_LIVE_DATA) {
      if (newData[prop]) update['$set'][prop] = newData[prop];
    }

    return this.aisLiveModel.updateOne(filter, update, {
      upsert: true,
    });
  }

  private insertBrut(createMessageDto: AisMessageDto) {
    const message = { ...createMessageDto };
    let loc = undefined;
    if (message.loc) {
      loc = message.loc.reverse();
    }

    return this.aisBrutModel.create({ ...message, loc: loc });
  }

  insertData(createMessageDto: AisMessageDto) {
    const operations = [this.insertBrut(createMessageDto), this.upsertLive(createMessageDto)];
    return Promise.all(operations);
  }
}
