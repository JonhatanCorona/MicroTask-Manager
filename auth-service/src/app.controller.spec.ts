import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './app.controller';
import { AppService } from './app.service';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AppService,
          useValue: {
            login: jest.fn().mockResolvedValue({ access_token: 'token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AppService>(AppService);
  });

  it('should return access token on login', async () => {
    const dto: LoginUserDto = { email: 'test@example.com', password: '1234' };
    const result = await authController.login(dto);
    expect(result).toEqual({ access_token: 'token' });
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
