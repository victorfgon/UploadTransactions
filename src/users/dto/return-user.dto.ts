import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDto {
  @ApiProperty({ type: User, description: 'The user object' })
  user: User;

  @ApiProperty({ description: 'The message string' })
  message: string;
}
