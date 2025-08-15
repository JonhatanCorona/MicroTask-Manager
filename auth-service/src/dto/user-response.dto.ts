import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserValidateDto {
  id: string;

  name: string;
  email: string;

  @Exclude()
  password?: string;

  constructor(partial: Partial<UserValidateDto>) {
    Object.assign(this, partial);
  }
}
