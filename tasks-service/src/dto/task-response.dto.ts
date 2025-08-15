import { IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from '../emun/enum-task';


export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
}

export class TaskResponseDto {
  id!: string;
  title!: string;
  description!: string;
  status!: TaskStatus;
  dueDate?: Date | null;
  assignedTo?: string | null;
}

export class AssignTaskDto {
  @IsOptional()           // Permite que venga vacío o null
  @IsString()             // Valida que si existe, sea string
  userId!: string | null;
}