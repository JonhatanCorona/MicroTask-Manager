import { IsOptional, IsUUID, Length, IsDateString, IsEnum } from 'class-validator';
import { TaskStatus } from '../emun/enum-task';

export class UpdateTaskDto {
  @IsOptional()
  @Length(1, 100, { message: 'El título no puede superar los 100 caracteres' })
  title?: string;

  @IsOptional()
  @Length(1, 500, { message: 'La descripción no puede superar los 500 caracteres' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha límite debe tener un formato de fecha válido (YYYY-MM-DD)' })
  dueDate?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Estado inválido. Los estados válidos son: por_hacer, en_progreso, completada' })
  status?: TaskStatus;

  @IsOptional()
  @IsUUID('4', { message: 'El ID asignado debe ser un UUID válido' })
  assignedToId?: string;
}
