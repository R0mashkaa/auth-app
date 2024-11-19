import { applyDecorators, UseGuards } from '@nestjs/common';
import { LoggerGuard } from '@app/common';

export const LoggerApi = (): ((...arg: unknown[]) => void) => {
  return applyDecorators(UseGuards(LoggerGuard));
};
