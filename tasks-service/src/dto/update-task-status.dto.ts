import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../emun/enum-task';

export class UpdateTaskStatusDto {
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(TaskStatus, { message: 'Estado inválido. Los estados válidos son: por_hacer, en_progreso, completada' })
  status!: TaskStatus;
}
