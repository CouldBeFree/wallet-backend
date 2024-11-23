import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @MinLength(10, { message: 'Password must be at least 10 characters long.' })
  @IsString()
  password: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
