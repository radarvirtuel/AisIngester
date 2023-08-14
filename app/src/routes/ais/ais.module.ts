import { Module } from '@nestjs/common';
import { AisService } from './ais.service';
import { AisController } from './ais.controller';
import { PrismaService } from 'src/prisma.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AisLive, AisLiveSchema } from 'src/mongoose/schemas/aisLive.schema';
import { AisBrut, AisBrutSchema } from 'src/mongoose/schemas/aisBrut.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AisLive.name, schema: AisLiveSchema },
      { name: AisBrut.name, schema: AisBrutSchema },
    ]),
  ],
  controllers: [AisController],
  providers: [AisService, PrismaService],
})
export class AisModule {}
