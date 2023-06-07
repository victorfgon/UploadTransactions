import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReturnUserDto } from './dto/return-user.dto';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private usersService: UsersService) {}

  @Post()
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
      return this.usersService.createAdminUser(createUserDto);
    } catch (error) {
      this.logger.error(`Failed to create admin user. Error: ${error.message}`);
      throw new Error('Failed to create admin user. Please try again later.');
    }
  }
}
