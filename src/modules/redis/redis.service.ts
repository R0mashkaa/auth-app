import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import {getConfig} from "@app/config";

@Injectable()
export class RedisService {
  private redis: Redis.Redis;

  constructor() {
    this.redis = new Redis.Redis({
      host: getConfig().redis_host,
      username: getConfig().redis_username,
      password: getConfig().redis_password,
      port: getConfig().redis_port,
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
