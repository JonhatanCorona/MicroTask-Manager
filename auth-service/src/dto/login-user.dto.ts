import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginUserDto  {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
