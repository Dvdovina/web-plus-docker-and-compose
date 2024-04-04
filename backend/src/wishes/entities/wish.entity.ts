import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { IsString, IsUrl, Length, IsNotEmpty, IsNumber } from 'class-validator';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @Column({ type: 'varchar' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column({ type: 'varchar' })
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column({ type: 'numeric', scale: 2 })
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column({ type: 'varchar' })
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column({ type: 'integer', default: 0 })
  copied: number;
}
