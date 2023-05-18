import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRole } from './user-roles.enum';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, passwordConfirmation } = createUserDto;

    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    }

    const user = new User();
    user.email = email;
    user.name = name;
    user.role = UserRole.ADMIN;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await this.entityManager.save(user);
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email address is already in use');
      } else {
        this.logger.error('Error saving user to database', error);
        throw new InternalServerErrorException('Error saving user to database');
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
