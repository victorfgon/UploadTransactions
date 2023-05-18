import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({
    description: 'The email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({ description: 'The password', example: 'password123' })
  password: string;
}
