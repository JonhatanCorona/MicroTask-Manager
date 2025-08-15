import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskStatus } from "./emun/enum-task";
import { Task, TaskDocument } from "./schema/task.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private httpService: HttpService,
  ) {}

  // ============================
  // HELPER: Buscar tarea por ID
  // ============================
  private async findTaskById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  // ============================
  // HELPER: Llamar a microservicio de usuarios
  // ============================
  async findUserById(userId: string, token: string): Promise<any> {
    if (!userId) throw new BadRequestException(`Invalid ID: ${userId}`);

    try {
      const response$ = this.httpService.get(`http://users-service:3001/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await firstValueFrom(response$);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      throw new BadRequestException(`Error fetching user: ${err.message}`);
    }
  }


  // ============================
  // HELPER: Validar y parsear dueDate
  // ============================
  private parseAndValidateDueDate(dueDate: string): Date {
    if (!dueDate) throw new BadRequestException('dueDate es obligatorio');

    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) throw new BadRequestException('Formato de fecha inválido');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) throw new BadRequestException('dueDate debe ser futura');

    return parsedDate;
  }

  // ============================
  // CREAR TAREA
  // ============================
  async createTask(dto: CreateTaskDto): Promise<TaskDocument> {
    const { title, description, dueDate, assignedToId } = dto;

    const task = new this.taskModel();
    task.title = title;
    task.description = description ?? '';
    task.dueDate = this.parseAndValidateDueDate(dueDate);
    task.assignedToId = assignedToId && assignedToId !== 'null' ? assignedToId : undefined;

    const savedTask = await task.save();

    return savedTask;
  }

  // ============================
  // ASIGNAR O DESASIGNAR TAREA
  // ============================
  async assignOrUnassignTask(taskId: string, userId: string | null, token: string) {
    const task = await this.findTaskById(taskId);

    if (userId) {
      const user = await this.findUserById(userId, token);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      task.assignedToId = userId;
      await task.save();

      return {
        message: 'Tarea asignada correctamente',
        taskId: task.id,
        userId: user.id,
        userName: user.name,
      };
    } else {
      task.assignedToId = null;
      await task.save();

      return {
        message: 'Tarea desasignada correctamente',
        taskId: task.id,
      };
    }
  }

  // ============================
  // OBTENER TODAS LAS TAREAS CON USUARIOS
  // ============================
  async getAllTasksWithUser(token: string) {
    const tasks = await this.taskModel.find().exec();

    const tasksWithUser = await Promise.all(
      tasks.map(async (task) => {
        let assignedUser = null;

        if (task.assignedToId) {
          try {
            const user = await this.findUserById(task.assignedToId, token);
            assignedUser = { id: user.id, name: user.name };
          } catch {
            assignedUser = null;
          }
        }

        return { ...task.toObject(), assignedTo: assignedUser };
      }),
    );

    return tasksWithUser;
  }

  // ============================
  // OBTENER TAREA POR ID
  // ============================
  async getTaskById(id: string): Promise<TaskDocument> {
    return this.findTaskById(id);
  }

  // ============================
  // ELIMINAR TAREA
  // ============================
  async deleteTask(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException(`Task ${id} not found`);
  }

  // ============================
  // ACTUALIZAR TAREA
  // ============================
  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.findTaskById(id);

    task.title = dto.title ?? task.title;
    task.description = dto.description ?? task.description;
    task.dueDate = dto.dueDate ? this.parseAndValidateDueDate(dto.dueDate) : task.dueDate;
    if (dto.assignedToId !== undefined) task.assignedToId = dto.assignedToId;

    const savedTask = await task.save();

    return savedTask;
  }

  // ============================
  // ACTUALIZAR ESTADO DE TAREA
  // ============================
  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskDocument> {
  const task = await this.findTaskById(id);

  task.previousStatus = task.status;

  task.status = status;

  return task.save();
}


// Revertir tarea al estado anterior
async revertTaskStatus(id: string): Promise<TaskDocument> {
  const task = await this.findTaskById(id);

  if (!task.previousStatus) {
    throw new BadRequestException('No hay estado anterior registrado');
  }

  const temp = task.status;
  task.status = task.previousStatus;
  task.previousStatus = temp;

  return task.save();
}


// Obtener todas las tareas por userId
async getTasksByUserId(userId: string, token: string) {
  const tasks = await this.taskModel.find({ assignedToId: userId }).exec();

  return Promise.all(
    tasks.map(async task => {
      let assignedUser = null;
      if (task.assignedToId) {
        try {
          const user = await this.findUserById(task.assignedToId, token);
          assignedUser = { id: user.id, name: user.name };
        } catch {
          assignedUser = null;
        }
      }

      // Excluir previousStatus directamente aquí
      return {
        id: (task._id as Types.ObjectId).toString(),
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate,
        assignedTo: assignedUser,
      };
    })
  );
}

}