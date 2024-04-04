import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { IsString, IsUrl, Length, IsNotEmpty } from 'class-validator';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @Column({ type: 'varchar' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column({ default: '', nullable: true })
  @Length(1, 1500)
  description: string;

  @Column({ type: 'varchar' })
  @IsUrl()
  @IsNotEmpty()
  image: string;
}
