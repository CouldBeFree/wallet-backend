import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseUserDto } from './dto/login-response-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('/api/auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SuccessResponse> {
    await this.userService.createUser(createUserDto);
    return {
      success: true,
    };
  }

  @Post('login')
  @HttpCode(200)
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginResponseUserDto> {
    return await this.userService.loginUser(loginUserDto);
  }

  @Get('getMe')
  @UseGuards(AuthGuard)
  async getMe(
    @Headers('authorization') authHeader: string,
  ): Promise<GetUserDto> {
    const token = authHeader.replace('Bearer', '').trim();
    return await this.userService.getMe(token);
  }
}
