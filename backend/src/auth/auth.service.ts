import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (createUserDto.password !== createUserDto.passwordConfirmation) {
        throw new UnprocessableEntityException('Unmatched passwords');
      }

      const { email, name, password } = createUserDto;

      const user = new User();
      user.email = email;
      user.name = name;
      user.role = UserRole.USER;
      user.status = true;
      user.confirmationToken = crypto.randomBytes(32).toString('hex');
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);

      await this.entityManager.save(user);
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `Email address is already in use. Error: ${error.message}`,
        );
        throw new ConflictException('Email address is already in use');
      } else {
        this.logger.error(
          `Error saving user to database. Error: ${error.message}`,
        );
        throw new InternalServerErrorException('Error saving user to database');
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signIn(credentialsDto: CredentialsDto) {
    try {
      const user = await this.checkCredentials(credentialsDto);

      if (user === null) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const jwtPayload = {
        id: user.id,
      };

      const token = this.jwtService.sign(jwtPayload);

      return { token };
    } catch (error) {
      this.logger.error(`Failed to sign in. Error: ${error.message}`);
      throw new UnauthorizedException('Failed to sign in');
    }
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    try {
      const { email, password } = credentialsDto;
      const user = await this.entityManager.findOne(User, {
        where: { email, status: true },
      });

      if (user && (await user.checkPassword(password))) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Failed to check user credentials. Error: ${error.message}`,
      );
      throw new UnauthorizedException('Failed to check user credentials');
    }
  }
}
