import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { AisMessageDto } from 'src/routes/ais/dto/ais-message.dto';

@Injectable()
export class AisValidatorGuard implements CanActivate {
  constructor(private mysql: PrismaService) {}
  calculateDistance(stationPos: number[], msgPos: number[]) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(msgPos[1] - stationPos[1]);
    const dLon = this.degToRad(msgPos[0] - stationPos[0]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(stationPos[1])) * Math.cos(this.degToRad(msgPos[1])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise(async (resolve) => {
      try {
        const request = context.switchToHttp().getRequest();

        if (request.method !== 'POST') return resolve(false);

        const requestData: AisMessageDto = request.body;

        if (requestData.scriptVersion !== 0.1) return resolve(false);

        const stationId = requestData.stationId;

        if (!stationId) return resolve(false);

        if (!requestData.timeStamp) return resolve(false);

        // Make mysql request
        const dbStation = await this.mysql.station.findUnique({
          where: {
            id: stationId,
          },
        });

        if (!dbStation) return resolve(false);

        const msgPos = requestData.loc;

        if (!msgPos) return resolve(true);

        const stationPos: number[] = [dbStation.lon, dbStation.lat];

        const maxDistanceThreshold = dbStation.range;

        const distance = this.calculateDistance(stationPos, msgPos);

        if (distance <= maxDistanceThreshold) return resolve(true);

        return resolve(false);
      } catch (error) {
        Logger.error(`AisValidator - ${error}`);
        return resolve(false);
      }
    });
  }
}
