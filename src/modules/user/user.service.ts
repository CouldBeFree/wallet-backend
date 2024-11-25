import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseUserDto } from './dto/login-response-user.dto';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isUserExists = await this.findUser(createUserDto);
    if (isUserExists) throw new BadRequestException('User already exists');
    const saltRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel
      .findOne({
        $or: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      })
      .exec();
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseUserDto> {
    const user = await this.userModel
      .findOne({ email: loginUserDto.email })
      .exec();

    if (!user) throw new BadRequestException('Wong credentials');
    const isValidPassword = await this.validatePassword(
      loginUserDto.password,
      user.password,
    );
    if (!isValidPassword) throw new BadRequestException('Wong credentials');
    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return new LoginResponseUserDto(user.email, user.username, token);
  }

  private async validatePassword(
    enteredPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword);
  }

  async getMe(userId: string): Promise<GetUserDto> {
    const user = await this.userModel.findById(userId);
    return new GetUserDto(user.email, user.username);
  }
}
