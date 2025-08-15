import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from "./health/health.module";


@Module({
  imports: [HealthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // se toma directamente del .env
      entities: [User],
      synchronize: true, // solo en desarrollo
    }),
    TypeOrmModule.forFeature([User]),
  ],
    controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}