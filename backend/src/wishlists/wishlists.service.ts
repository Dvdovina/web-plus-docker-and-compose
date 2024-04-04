import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, сreateWishlistDto: CreateWishlistDto) {
    const { itemsId } = сreateWishlistDto;
    const wishes = itemsId.map((id) => {
      return this.wishesService.findOne(id);
    });

    return await Promise.all(wishes).then((items) => {
      const wishlist = this.wishlistsRepository.create({
        ...сreateWishlistDto,
        owner: user,
        items,
      });
      return this.wishlistsRepository.save(wishlist);
    });
  }

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: { items: true, owner: true },
    });
    return wishlists;
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    return wishlist;
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Нельзя редактировать чужие списки');
    }
    const { name, image, itemsId } = updateWishlistDto;
    const wishesPromises = itemsId.map((itemId) =>
      this.wishesService.findOne(itemId),
    );
    const wishes = await Promise.all(wishesPromises);
    if (wishes.some((wish) => !wish)) {
      throw new NotFoundException('Подарок не найден');
    }
    wishlist.name = name;
    wishlist.image = image;
    wishlist.items = wishes;
    return this.wishlistsRepository.save(wishlist);
  }

  async removeOne(userId: number, listId: number) {
    const wishlist = await this.findOne(listId);
    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }
    if (userId !== wishlist.owner.id) {
      throw new BadRequestException('Нельзя удалять чужие списки');
    }
    await this.wishlistsRepository.delete(listId);
    return wishlist;
  }
}
