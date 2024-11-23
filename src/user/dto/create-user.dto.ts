import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(5, { message: 'Username must be at least 8 characters long.' })
  @IsString()
  username: string;

  @MinLength(10, { message: 'Password must be at least 10 characters long.' })
  @IsString()
  password: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
