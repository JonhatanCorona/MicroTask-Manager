
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../enum/roles.enum';

@Entity({ name: 'user' }) 
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;
}
