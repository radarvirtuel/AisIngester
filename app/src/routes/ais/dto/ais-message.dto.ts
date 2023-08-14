import { IsString, IsNumber, IsBoolean, IsDateString, IsArray } from 'class-validator';

export class AisMessageDto {
  @IsNumber()
  readonly mmsi: number;

  @IsNumber()
  readonly stationId: number;

  @IsNumber()
  readonly messageType: number;

  @IsDateString()
  readonly timestamp: string;

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
  readonly callsign?: string;

  @IsString()
  readonly destination?: string;

  @IsNumber()
  readonly draught?: number;

  @IsString()
  readonly eta?: string;

  @IsNumber()
  readonly imo?: number;

  @IsNumber()
  readonly ship_type?: number;

  @IsString()
  readonly shipname?: string;

  @IsNumber()
  readonly to_bow?: number;

  @IsNumber()
  readonly to_port?: number;

  @IsNumber()
  readonly to_starboard?: number;

  @IsNumber()
  readonly to_stern?: number;
}
