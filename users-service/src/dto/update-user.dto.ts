import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password!: string;
}
