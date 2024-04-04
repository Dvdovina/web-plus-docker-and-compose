import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    return this.wishesRepository.save(wish);
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishesRepository.find();
  }

  async findLatestWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new BadRequestException(
        'Нельзя редактировать подарки других пользователей',
      );
    }
    if (wish.raised && updateWishDto.price > 0) {
      throw new BadRequestException(
        'Нельзя менять стоимость подарка после начала сбора средств',
      );
    }
    return await this.wishesRepository.update(wishId, {
      ...updateWishDto,
      updatedAt: new Date(),
    });
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id === wish.owner.id) {
      throw new BadRequestException('Нельзя копировать свои подарки');
    }
    wish.copied += 1;
    const copy = await this.wishesRepository.create({
      ...wish,
      owner: user,
      copied: 0,
      id: undefined,
    });
    this.wishesRepository.save(wish);
    return this.wishesRepository.save(copy);
  }

  async removeOne(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new BadRequestException(
        'Нельзя удалять подарки других пользователей',
      );
    }
    return await this.wishesRepository.delete(wishId);
  }
}
