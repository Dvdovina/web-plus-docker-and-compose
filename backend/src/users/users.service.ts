import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(сreateUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(сreateUserDto);
    try {
      const hashValue = await hash(user.password, 10);
      user.password = hashValue;
    } catch (error) {
      throw new Error(error);
    }
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(username: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect(['user.password'])
      .getOne();
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findMany({ query }: FindUserDto): Promise<User[]> {
    const user = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findUserWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes;
  }

  async findWishesByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      try {
        const hashValue = await hash(updateUserDto.password, 10);
        updateUserDto.password = hashValue;
      } catch (error) {
        throw new Error(error);
      }
    }
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.usersRepository.save(user);
  }

  async removeOne(userId: number) {
    return await this.usersRepository.delete(userId);
  }
}
