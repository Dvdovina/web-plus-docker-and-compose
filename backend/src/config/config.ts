import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

const { POSTGRES_HOST = "localhost",
  POSTGRES_PORT = "5432",
  POSTGRES_USER = "student",
  POSTGRES_PASSWORD = "student",
  POSTGRES_DB = "kupipodariday" } = process.env;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: +POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [Wish, Wishlist, User, Offer],
  synchronize: true,
};
