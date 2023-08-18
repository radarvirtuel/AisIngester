import { IsString, IsNumber, IsBoolean, IsDateString, IsArray } from 'class-validator';

export class AisMessageDto {
  @IsNumber()
  readonly mmsi: number;

  @IsNumber()
  readonly stationId: number;

  @IsNumber()
  readonly messageType: number;

  @IsDateString()
  readonly timeStamp: string;

  @IsArray()
  readonly loc?: number[];

  @IsNumber()
  readonly heading?: number;

  @IsNumber()
  readonly maneuver?: number;

  @IsNumber()
  readonly status?: number;

  @IsNumber()
  readonly turn?: number;

  @IsNumber()
  readonly course?: number;

  @IsNumber()
  readonly speed?: number;

  @IsBoolean()
  readonly accuracy?: boolean;

  @IsString()
  readonly callSign?: string;

  @IsString()
  readonly destination?: string;

  @IsNumber()
  readonly draught?: number;

  @IsString()
  readonly eta?: string;

  @IsNumber()
  readonly imo?: number;

  @IsNumber()
  readonly shipType?: number;

  @IsString()
  readonly shipName?: string;

  @IsNumber()
  readonly toBow?: number;

  @IsNumber()
  readonly toPort?: number;

  @IsNumber()
  readonly toStarboard?: number;

  @IsNumber()
  readonly toStern?: number;
}
