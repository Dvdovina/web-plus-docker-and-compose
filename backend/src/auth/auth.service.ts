import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SigninDto } from './dto/signin.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signin(signinDto: SigninDto) {
    const user = await this.usersService.findByUsername(signinDto.username);
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async validateUserInfo(signinDto: SigninDto) {
    const user = await this.usersService.findOne(signinDto.username);
    if (!user || !(await compare(signinDto.password, user.password))) {
      throw new UnauthorizedException('Неверный пароль или имя пользователя');
    }
    return user;
  }
}
