import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Req,
  Post,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findMe(@Req() req): Promise<User> {
    return await this.usersService.findById(req.user.id);
  }

  @Post('find')
  async findMany(@Body() findUserDto: FindUserDto): Promise<User[]> {
    return await this.usersService.findMany(findUserDto);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get('me/wishes')
  async findUserWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.findUserWishes(req.user.id);
  }

  @Get(':username/wishes')
  async findWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishesByUsername(username);
  }

  @Patch('me')
  async updateOne(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }
}
