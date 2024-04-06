import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmConfig } from './config/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { WishesModule } from './wishes/wishes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wish } from './wishes/entities/wish.entity'; 

@Module({
  imports: [    UsersModule,
    WishlistsModule,
    OffersModule,
    WishesModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true, 
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
