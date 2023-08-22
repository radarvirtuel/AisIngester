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
    const { timeStamp, loc, mmsi, ...newData } = createMessageDto;
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
      update['$set']['lastLoc'] = {
        type: 'Point',
        coordinates: loc.reverse(),
      };

      if (!existingDocument || !existingDocument.firstLoc) {
        update['$set']['firstLoc'] = {
          type: 'Point',
          coordinates: loc.reverse(),
        };
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
    let loc = undefined;
    if (createMessageDto.loc) {
      loc = {
        type: 'Point',
        coordinates: createMessageDto.loc.reverse(),
      };
    }

    return this.aisBrutModel.create({ ...createMessageDto, loc: loc });
  }

  insertData(createMessageDto: AisMessageDto) {
    const operations = [this.insertBrut(createMessageDto), this.upsertLive(createMessageDto)];
    return Promise.all(operations);
  }
}
