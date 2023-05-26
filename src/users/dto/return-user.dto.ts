import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDto {
  @ApiProperty({
    description: 'Email address',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    description: 'The message string',
  })
  message: string;
}
