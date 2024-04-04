import { Injectable, BadRequestException } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const offerOwner = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!offerOwner) {
        throw new BadRequestException('Пользователь не найден');
      }

      const wish = await queryRunner.manager.findOne(Wish, {
        where: { id: itemId },
        relations: { owner: true },
      });

      if (wish.owner.id === userId) {
        throw new BadRequestException(
          'Скидываться можно только на подарки другим пользователям',
        );
      }

      const raised: number = amount + wish.raised;
      if (raised > wish.price) {
        throw new BadRequestException({
          message: 'Сумма превышает стоимость подарка',
          raised: raised,
          price: wish.price,
        });
      }
      wish.raised = raised;

      await queryRunner.manager.update(Wish, itemId, { raised });
      await queryRunner.commitTransaction();
      return await this.offersRepository.save({
        ...createOfferDto,
        user: offerOwner,
        amount,
        item: wish,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offersRepository.find({
      where: { hidden: false },
      relations: { user: true, item: true },
    });
  }

  async findOne(id: number) {
    return await this.offersRepository.findOne({
      where: { id },
      relations: { user: true, item: true },
    });
  }
}
