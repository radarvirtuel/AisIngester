import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AisMessageDto } from './dto/ais-message.dto';
import { AisLive } from 'src/mongoose/schemas/aisLive.schema';
import { AisBrut } from 'src/mongoose/schemas/aisBrut.schema';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AisService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(AisLive.name) private aisLiveModel: Model<AisLive>,
    @InjectModel(AisBrut.name) private aisBrutModel: Model<AisBrut>
  ) {}

  AIS_DYNAMIC_DATA = ['speed', 'heading', 'turn', 'course', 'maneuver', 'status', 'destination', 'accuracy', 'draught', 'eta'];
  AIS_STATIC_DATA = ['imo', 'callSign', 'shipType', 'shipName', 'toBow', 'toStern', 'toPort', 'toStarboard'];

  private async upsertLive(createMessageDto: AisMessageDto) {
    const { timeStamp, loc, mmsi, ...newData } = createMessageDto;
    const filter = { mmsi: mmsi };
    const existingDocument = await this.aisLiveModel.findOne(filter).exec();
    const update = {
      $setOnInsert: { firstTs: new Date(timeStamp) },
      $max: { lastTs: new Date(timeStamp) },
      $set: {},
    };

    if (loc) {
      update['$inc'] = { cptPos: 1 };
      update['$set']['lastLoc'] = loc;

      if (!existingDocument || !existingDocument.firstLoc) {
        update['$set']['firstLoc'] = loc;
      }
    }

    const staticUpdate = {};
    for (const prop of this.AIS_STATIC_DATA) {
      if (newData[prop]) staticUpdate[prop] = newData[prop];
    }
    for (const prop of this.AIS_DYNAMIC_DATA) {
      if (newData[prop]) update['$set'][prop] = newData[prop];
    }

    const staticInsert = this.prisma.vessel.upsert({
      where: {
        mmsi: mmsi,
      },
      update: {
        ...staticUpdate,
        updated: new Date(),
      },
      create: {
        mmsi: mmsi,
        ...staticUpdate,
      },
    });

    const dynamicInsert = this.aisLiveModel
      .updateOne(filter, update, {
        upsert: true,
      })
      .exec();

    return Promise.all([staticInsert, dynamicInsert]);
  }

  private insertBrut(createMessageDto: AisMessageDto) {
    const msgCopy = { ...createMessageDto };
    for (const prop of this.AIS_STATIC_DATA) {
      delete msgCopy[prop];
    }

    return this.aisBrutModel.create(msgCopy);
  }

  insertData(createMessageDto: AisMessageDto) {
    const operations = [this.insertBrut(createMessageDto), this.upsertLive(createMessageDto)];
    return Promise.all(operations);
  }
}
