import { Controller, Get, Post, Delete, Param, Body, Patch, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto, TaskResponseDto } from './dto/task-response.dto';
import { AppService } from './tasks.service';
import { TaskDocument } from './schema/task.schema';
import { ObjectId } from 'mongoose';
import { Request } from 'express';
import { getBearerToken } from './util/task-util';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from './common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class AppController {
  constructor(private readonly tasksService: AppService) {}

  // ============================
  // HELPER: Map Task Document to DTO
  // ============================
  private mapTaskToDto(task: TaskDocument): TaskResponseDto {
    return {
      id: (task._id as ObjectId).toString(), 
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedToId, 
    };
  }

  // ============================
  // CREATE TASK
  // ============================
  @Post() 
  async createTask(@Body() dto: CreateTaskDto): Promise<{ message: string; taskId: string }> {
    if (!dto) {
      throw new BadRequestException('El cuerpo es obligatorio');
    }

    const task = await this.tasksService.createTask(dto);

    return {
      message: 'Tarea creada correctamente',
      taskId: task.id, 
    };
  }

  // ============================
  // UPDATE TASK
  // ============================
  @Patch(':id')
  async updateTask(
    @Param('id') id: string, 
    @Body() dto: UpdateTaskDto, 
    @Req() request?: Request
  ): Promise<TaskResponseDto> {
    if (!dto) {
      throw new BadRequestException('El campo userId es obligatorio');
    }
    const token = getBearerToken(request);
    const task = await this.tasksService.updateTask(id, dto);
    return this.mapTaskToDto(task);
  }

  // ============================
  // ASSIGN OR UNASSIGN TASK
  // ============================
  @Patch(':id/assign')
  async assignOrUnassignTask(
    @Param('id') id: string,
    @Body() dto: AssignTaskDto,
    @Req() request?: Request
  ): Promise<any> {
    const token = getBearerToken(request);
    const result = await this.tasksService.assignOrUnassignTask(id, dto.userId, token);
    return result;
  }

  // ============================
  // UPDATE TASK STATUS
  // ============================
  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string, 
    @Body() dto: UpdateTaskStatusDto
  ): Promise<TaskResponseDto> {
    const task = await this.tasksService.updateTaskStatus(id, dto.status);
    return this.mapTaskToDto(task);
  }

  // ============================
  // DELETE TASK
  // ============================
  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string }> {
    await this.tasksService.deleteTask(id as string);
    return { message: `Tarea con ID ${id} eliminada correctamente` };
  }

  // ============================
  // GET ALL TASKS
  // ============================
  @Get()
async getTasks(@Req() req: Request) {
  const token = (req as any).token;
  const tasks = await this.tasksService.getAllTasksWithUser(token);

  return tasks.map(({ previousStatus, ...taskWithoutPrevious }) => taskWithoutPrevious);
}

  // ============================
  // GET TASK BY ID
  // ============================
  @Get(':id')
async getTaskById(@Param('id') id: string): Promise<any> {
  const task = await this.tasksService.getTaskById(id);

  // Creamos una copia y quitamos previousStatus
  const { previousStatus, ...taskWithoutPrevious } = task.toObject ? task.toObject() : task;

  return taskWithoutPrevious;
}

  @Patch(':id/revert')
async revertTaskStatus(@Param('id') id: string): Promise<TaskResponseDto> {
  const task = await this.tasksService.revertTaskStatus(id);
  return this.mapTaskToDto(task);
}

// Obtener todas las tareas por userId
@Get('user/:userId')
async getTasksByUserId(@Param('userId') userId: string, @Req() req: Request) {
  const token = getBearerToken(req);
  return this.tasksService.getTasksByUserId(userId, token);
}
}
