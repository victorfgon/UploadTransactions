import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users/user-roles.enum';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';

const mockUser = new User();
mockUser.email = 'johndoe@example.com';
mockUser.name = 'John Doe';
mockUser.role = UserRole.USER;
mockUser.status = true;
mockUser.confirmationToken = expect.any(String);
mockUser.salt = 'salt';
mockUser.password = 'password';
mockUser.checkPassword = jest.fn();

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(mockUser);

      const result = await authController.signUp(createUserDto);

      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        message: 'Registration successfully completed',
      });
    });

    it('should handle sign up errors', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      };

      const error = new Error('Sign up failed');
      jest.spyOn(authService, 'signUp').mockRejectedValueOnce(error);

      await expect(authController.signUp(createUserDto)).rejects.toThrow(error);
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('signIn', () => {
    it('should sign in a user', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      const token = 'dummyToken';
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce({ token });

      const result = await authController.signIn(credentialsDto);

      expect(authService.signIn).toHaveBeenCalledWith(credentialsDto);
      expect(result).toEqual({ token });
    });

    it('should handle sign in errors', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      const error = new Error('Sign in failed');
      jest.spyOn(authService, 'signIn').mockRejectedValueOnce(error);

      await expect(authController.signIn(credentialsDto)).rejects.toThrow(
        error,
      );
      expect(authService.signIn).toHaveBeenCalledWith(credentialsDto);
    });
  });

  describe('getMe', () => {
    it('should return the authenticated user', () => {
      const result = authController.getMe(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
});
