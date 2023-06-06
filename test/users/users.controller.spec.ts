import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { ReturnUserDto } from '../../src/users/dto/return-user.dto';
import { EntityManager } from 'typeorm';
import { mock, instance } from 'ts-mockito';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let mockReturnUserDto: ReturnUserDto;

  beforeEach(() => {
    const entityManagerMock: EntityManager = mock(EntityManager);
    usersService = new UsersService(instance(entityManagerMock));
    usersController = new UsersController(usersService);
    mockReturnUserDto = {
      email: 'example@example.com',
      name: 'John Doe',
      message: 'Admin user successfully registered',
    };
  });

  describe('createAdminUser', () => {
    const mockCreateUserDto: CreateUserDto = {
      email: 'example@example.com',
      name: 'John Doe',
      password: 'password123',
      passwordConfirmation: 'password123',
    };

    it('should create an admin user', async () => {
      jest
        .spyOn(usersService, 'createAdminUser')
        .mockResolvedValueOnce(mockReturnUserDto);

      const result: ReturnUserDto = await usersController.createAdminUser(
        mockCreateUserDto,
      );

      expect(usersService.createAdminUser).toHaveBeenCalledWith(
        mockCreateUserDto,
      );
      expect(result).toEqual(mockReturnUserDto);
    });

    it('should handle errors and throw an error message', async () => {
      const errorMessage = 'Error saving user to database';
      jest
        .spyOn(usersService, 'createAdminUser')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        usersController.createAdminUser(mockCreateUserDto),
      ).rejects.toThrowError(errorMessage);

      expect(usersService.createAdminUser).toHaveBeenCalledWith(
        mockCreateUserDto,
      );
    });
  });
});
