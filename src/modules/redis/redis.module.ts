import { Module } from '@nestjs/common';

import { RedisService } from './redis.service';

const providers = [RedisService];

@Module({
  providers,
  exports: providers,
})
export class RedisModule {}
