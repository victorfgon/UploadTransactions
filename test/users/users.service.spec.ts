import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { User } from '../../src/users/user.entity';
import { UserRole } from '../../src/users/user-roles.enum';
import {
  UnprocessableEntityException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from '../../src/users/dto/return-user.dto';

const mockEntityManager = () => ({
  save: jest.fn(),
});

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mockSalt'),
  hash: jest.fn().mockResolvedValue('mockHashedPassword'),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: EntityManager, useFactory: mockEntityManager },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(entityManager).toBeDefined();
  });

  describe('createAdminUser', () => {
    let mockCreateUserDto: CreateUserDto;
    let mockReturnUserDto: ReturnUserDto;
    let mockUser: User;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'example@example.com',
        name: 'John Doe',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      mockReturnUserDto = {
        email: 'example@example.com',
        name: 'John Doe',
        message: 'Admin user successfully registered',
      };

      mockUser = new User();
      mockUser.email = mockCreateUserDto.email;
      mockUser.name = mockCreateUserDto.name;
      mockUser.role = UserRole.ADMIN;
      mockUser.status = true;
      mockUser.confirmationToken = expect.any(String);
      mockUser.salt = 'mockSalt';
      mockUser.password = 'mockHashedPassword';
    });

    it('should create an admin user', async () => {
      const saveSpy = jest
        .spyOn(entityManager, 'save')
        .mockResolvedValueOnce(Object.assign(new User(), mockUser));

      const result = await usersService.createAdminUser(mockCreateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockSalt');
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          status: mockUser.status,
          confirmationToken: expect.any(String),
          salt: mockUser.salt,
          password: mockUser.password,
        }),
      );
      expect(result).toEqual(mockReturnUserDto);
    });

    it('should throw an UnprocessableEntityException if passwords do not match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';

      await expect(
        usersService.createAdminUser(mockCreateUserDto),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should throw a ConflictException if email address is already in use', async () => {
      jest.spyOn(entityManager, 'save').mockRejectedValue({ code: '23505' });

      await expect(
        usersService.createAdminUser(mockCreateUserDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw an InternalServerErrorException if there is an error saving user to database', async () => {
      jest.spyOn(entityManager, 'save').mockRejectedValue(new Error());

      await expect(
        usersService.createAdminUser(mockCreateUserDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
