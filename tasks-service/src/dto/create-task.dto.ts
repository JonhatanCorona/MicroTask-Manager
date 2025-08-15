import { IsNotEmpty, IsOptional, IsUUID, Length, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @Length(1, 100, { message: 'El título no puede superar los 100 caracteres' })
  title!: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @Length(1, 2000, { message: 'La descripción no puede superar los 500 caracteres' })
  description!: string;

  @IsNotEmpty({ message: 'La fecha límite es obligatoria' })
  @IsDateString({}, { message: 'La fecha límite debe tener un formato de fecha válido (YYYY-MM-DD)' })
  dueDate!: string;

  @IsOptional()
  @IsUUID('4', { message: 'El ID asignado debe ser un UUID válido' })
  assignedToId?: string;
}
