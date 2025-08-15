import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AppService } from './app.service';
import { User } from './entity/user.entity';
import { AuthGuard } from './common/guards/auth.guard';
import { UuidValidationPipe } from './common/pipes/uuid-validation.pipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RolesGuard } from './common/guards/roles.guard';
import { UserRole } from './enum/roles.enum';
import { Roles } from './common/decorators/roles.decorator';

@Controller('users')
export class AppController {
  constructor(
    private readonly usersService: AppService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<{ message: string }> {
    await this.usersService.createUser(dto);
    return { message: 'Usuario creado correctamente' };
  }

  @Get()
  async getAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return this.usersService.getAllUsers(pageNumber, limitNumber);
  }

  @Get('by-email')
  async findByEmail(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    return this.usersService.findByEmail(email, password);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = req['user']?.sub;
    if (!userId) throw new BadRequestException('ID no válido');
    const user = await this.usersService.updateUser(userId, dto);
    return { message: 'Usuario actualizado correctamente', user };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<UserResponseDto> {
    const userId = req['user']?.sub;
    if (!userId) throw new BadRequestException('ID no válido');
    return this.usersService.findById(userId);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getUser(@Param('id', UuidValidationPipe) id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async updateUser(@Param('id', UuidValidationPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id', UuidValidationPipe) id: string) {
    await this.usersService.deleteUser(id);
    return { message: `Usuario con ID ${id} eliminado correctamente` };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  async updateUserRole(
    @Param('id', UuidValidationPipe) id: string,
    @Body('role') role: UserRole,
  ) {
    if (!role) throw new BadRequestException('Se debe proporcionar un rol válido');
    await this.usersService.updateUserRole(id, role);
    return {
      message: `Rol del usuario actualizado a ${role} correctamente`,
    };
  }
}
