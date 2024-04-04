import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { IsString, IsUrl, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ type: 'varchar', default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
