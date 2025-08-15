import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserResponseDto {
  id!: string;

  name!: string;
  email!: string;

  @Exclude()
  password?: string;
}


export interface PaginatedUsers {
  data: UserResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}