import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'Email address',
    maxLength: 200,
  })
  @IsNotEmpty({
    message: 'Please provide an email address',
  })
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  @MaxLength(200, {
    message: 'Email address must be less than 200 characters',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    maxLength: 200,
  })
  @IsNotEmpty({
    message: 'Please provide the user name',
  })
  @MaxLength(200, {
    message: 'Name must be less than 200 characters',
  })
  name: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsNotEmpty({
    message: 'Please provide a password',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password confirmation',
    minLength: 6,
  })
  @IsNotEmpty({
    message: 'Please provide the password confirmation',
  })
  @MinLength(6, {
    message: 'Password confirmation must be at least 6 characters long',
  })
  passwordConfirmation: string;
}
