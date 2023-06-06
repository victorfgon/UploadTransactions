import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { GetUser } from './get-user.decorator';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/v1/auth')
@ApiTags('Authentication')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'Registration successfully completed',
  })
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.signUp(createUserDto);
      return {
        message: 'Registration successfully completed',
      };
    } catch (error) {
      this.logger.error(`Error occurred during sign up: ${error.message}`);
      throw error;
    }
  }

  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: String,
  })
  async signIn(
    @Body(ValidationPipe) credentialsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    try {
      return await this.authService.signIn(credentialsDto);
    } catch (error) {
      this.logger.error(`Error occurred during sign in: ${error.message}`);
      throw error;
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns the currently authenticated user',
  })
  getMe(@GetUser() user: User): User {
    return user;
  }
}
