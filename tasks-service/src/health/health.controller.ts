import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongo: MongooseHealthIndicator, // si usas TypeORM o reemplaza por MongoHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.mongo.pingCheck('mongo', { timeout: 3000 }),
    ]);
  }
}