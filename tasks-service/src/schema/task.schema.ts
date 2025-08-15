import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from '../emun/enum-task';


export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, maxlength: 100 })
  title!: string;

  @Prop({ maxlength: 2000 })
  description?: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ type: String, default: null }) 
  assignedToId?: string | null; // Puede ser null si no está asignada a nadie 

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  previousStatus?: TaskStatus;
   // Para rastrear el estado anterior
}

export const TaskSchema = SchemaFactory.createForClass(Task);
