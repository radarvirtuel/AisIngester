import { Controller, Post, Body, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AisService } from './ais.service';
import { AisMessageDto } from './dto/ais-message.dto';
import { AisValidator } from 'src/decorators/ais-validator/ais-validator.decorator';

@ApiTags('ingester')
@Controller('ingester')
export class AisController {
  constructor(private readonly aisService: AisService) {}

  @Post()
  @AisValidator()
  async create(@Body() createMessageDto: AisMessageDto) {
    try {
      await this.aisService.insertData(createMessageDto);
    } catch (e) {
      Logger.error(`AisController - ${e}`);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
