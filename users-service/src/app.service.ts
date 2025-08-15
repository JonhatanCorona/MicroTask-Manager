import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isEmail, isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { UserResponseDto, PaginatedUsers } from './dto/user-response.dto';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { UserRole } from './enum/roles.enum';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    if (!dto) throw new BadRequestException('No se enviaron datos para crear el usuario');
    const { name, email, password } = dto;

    if (!name || name.length > 100) {
      throw new BadRequestException('El nombre es obligatorio y máximo 100 caracteres');
    }

    if (!email || !isEmail(email)) {
      throw new BadRequestException('Email inválido');
    }

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new BadRequestException('El email ya está registrado');

    if (!password || password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);
    return plainToInstance(UserResponseDto, saved);
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<PaginatedUsers> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    // Eliminar password antes de devolver
    const usersWithoutPassword  = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });

    return {
      data: usersWithoutPassword,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }



  async findById(id: string): Promise<UserResponseDto> {
    if (!isUUID(id)) throw new BadRequestException('ID no válido');
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return plainToInstance(UserResponseDto, user);
  }

  async findByEmail(email: string, password: string) {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) throw new BadRequestException('Usuario no encontrado');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new BadRequestException('Contraseña incorrecta');

  const { id, role, email: userEmail } = user;
  return { id, role, email: userEmail };
}

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (!dto) throw new BadRequestException('No se enviaron datos para actualizar el usuario');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    if (dto.name && dto.name.length > 100) throw new BadRequestException('El nombre máximo es 100 caracteres');

    if (dto.email) {
      if (!isEmail(dto.email)) throw new BadRequestException('Email inválido');
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing && existing.id !== id) throw new BadRequestException('El email ya está registrado');
    }

    if (dto.password && dto.password.length < 6) throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

    Object.assign(user, dto);
    const updated = await this.userRepository.save(user);
    return plainToInstance(UserResponseDto, updated);
  }

  async deleteUser(id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('ID no válido');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    try {
      await this.userRepository.delete(id);

      // Aquí se podría emitir un evento para otros microservicios
      // eventEmitter.emit('user.deleted', { userId: id });

    } catch (error) {
  const e = error as Error;
  console.log(e.message);
}
  }

  async updateUserRole(userId: string, role: UserRole) {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) throw new BadRequestException('Usuario no encontrado');

  user.role = role;
  await this.userRepository.save(user);

  return user;
}
}
