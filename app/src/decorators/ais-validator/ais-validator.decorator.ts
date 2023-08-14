import { applyDecorators, UseGuards } from '@nestjs/common';
import { AisValidatorGuard } from 'src/guards/ais-validator/ais-validator.guard';

export function AisValidator() {
  return applyDecorators(UseGuards(AisValidatorGuard));
}
