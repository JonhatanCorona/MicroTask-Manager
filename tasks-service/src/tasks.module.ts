import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "./schema/task.schema";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AppService } from "./tasks.service";
import { AppController } from "./tasks.controller";
import * as dotenv from 'dotenv';
import { HealthModule } from "./health/health.module";

dotenv.config();

@Module({
  imports: [
    HttpModule,
    HealthModule,
    MongooseModule.forRoot(process.env.MONGODB as string), // Conexión a Mongo
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]) // Modelo Task
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
