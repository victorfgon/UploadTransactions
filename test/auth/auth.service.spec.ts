import { Test } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users/user-roles.enum';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';

const mockUser = new User();
mockUser.email = 'johndoe@example.com';
mockUser.name = 'John Doe';
mockUser.role = UserRole.USER;
mockUser.status = true;
mockUser.confirmationToken = expect.any(String);
mockUser.salt = 'salt';
mockUser.password = 'password';
mockUser.checkPassword = jest.fn();

const entityManagerMock = () => ({
  save: jest.fn(),
  findOne: jest.fn().mockResolvedValueOnce(mockUser),
});

const jwtServiceMock = () => ({
  sign: jest.fn().mockReturnValueOnce('jwtToken'),
});

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('password'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let entityManager: EntityManager;
  let jwtService: JwtService;

  beforeEach(async () => {
    entityManager = {} as EntityManager;
    jwtService = {} as JwtService;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: EntityManager, useFactory: entityManagerMock },
        { provide: JwtService, useFactory: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    entityManager = module.get<EntityManager>(EntityManager);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(entityManager).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user and return it without sensitive information', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      };

      jest.mock('crypto', () => ({
        randomBytes: jest
          .fn()
          .mockReturnValueOnce(Buffer.from(mockUser.confirmationToken, 'hex')),
      }));

      const result = await authService.signUp(createUserDto);

      expect(entityManager.save).toHaveBeenCalledWith(expect.any(User));
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        mockUser.salt,
      );

      const expectedUser = new User();
      expectedUser.email = 'johndoe@example.com';
      expectedUser.name = 'John Doe';
      expectedUser.role = UserRole.USER;
      expectedUser.status = true;
      expectedUser.confirmationToken = expect.any(String);

      expect(result).toEqual(expectedUser);
    });

    it('should throw ConflictException if email address is already in use', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      };

      jest
        .spyOn(entityManager, 'save')
        .mockRejectedValueOnce({ code: '23505' });

      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(entityManager.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw InternalServerErrorException if error occurs while saving user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      };

      jest
        .spyOn(entityManager, 'save')
        .mockRejectedValueOnce(new Error('Error saving user to database'));

      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(entityManager.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw InternalServerErrorException if passwords do not match', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        passwordConfirmation: 'differentpassword',
      };

      await expect(authService.signUp(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(entityManager.save).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in user and return JWT token', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'checkCredentials')
        .mockResolvedValueOnce(mockUser);

      const result = await authService.signIn(credentialsDto);

      expect(authService.checkCredentials).toHaveBeenCalledWith(credentialsDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
      expect(result).toEqual({ token: 'jwtToken' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'checkCredentials').mockResolvedValueOnce(null);

      await expect(authService.signIn(credentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.checkCredentials).toHaveBeenCalledWith(credentialsDto);
    });

    it('should throw UnauthorizedException if error occurs while signing in', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'checkCredentials')
        .mockRejectedValueOnce(new Error('Failed to sign in'));

      await expect(authService.signIn(credentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.checkCredentials).toHaveBeenCalledWith(credentialsDto);
    });
  });

  describe('checkCredentials', () => {
    it('should return user if credentials are valid', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest.spyOn(mockUser, 'checkPassword').mockResolvedValueOnce(true);

      const result = await authService.checkCredentials(credentialsDto);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        where: { email: credentialsDto.email, status: true },
      });
      expect(mockUser.checkPassword).toHaveBeenCalledWith(
        credentialsDto.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(null);

      const result = await authService.checkCredentials(credentialsDto);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        where: { email: credentialsDto.email, status: true },
      });
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const credentialsDto: CredentialsDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest.spyOn(mockUser, 'checkPassword').mockResolvedValueOnce(false);

      const result = await authService.checkCredentials(credentialsDto);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        where: { email: credentialsDto.email, status: true },
      });
      expect(mockUser.checkPassword).toHaveBeenCalledWith(
        credentialsDto.password,
      );
      expect(result).toBeNull();
    });
  });
});
