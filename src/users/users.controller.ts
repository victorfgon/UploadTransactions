import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReturnUserDto } from './dto/return-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from './user-roles.enum';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private usersService: UsersService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create admin user' })
  @ApiResponse({
    status: 201,
    description: 'Admin user successfully created',
    type: ReturnUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    try {
      const user = await this.usersService.createAdminUser(createUserDto);
      return {
        user,
        message: 'Admin user successfully registered',
      };
    } catch (error) {
      this.logger.error(`Failed to create admin user. Error: ${error.message}`);
      throw new Error('Failed to create admin user. Please try again later.');
    }
  }
}
