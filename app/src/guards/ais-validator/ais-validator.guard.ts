import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { AisMessageDto } from 'src/routes/ais/dto/ais-message.dto';

@Injectable()
export class AisValidatorGuard implements CanActivate {
  constructor(
    private mysql: PrismaService,
    private config: ConfigService
  ) {}
  calculateDistance(stationPos: number[], msgPos: number[]) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(msgPos[0] - stationPos[0]);
    const dLon = this.degToRad(msgPos[1] - stationPos[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(stationPos[0])) * Math.cos(this.degToRad(msgPos[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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

        const stationId = requestData.stationId;

        if (!stationId) return resolve(false);

        if (!requestData.timestamp) return resolve(false);

        // Make mysql request
        const dbStation = await this.mysql.station.findUnique({
          where: {
            id: stationId,
          },
        });

        if (!dbStation) return resolve(false);

        const msgPos = requestData.loc;

        if (!msgPos) return resolve(true);

        const stationPos: number[] = [dbStation.lat, dbStation.lon];

        const maxDistanceThreshold = this.config.get('ingesterMaxDistance');

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
