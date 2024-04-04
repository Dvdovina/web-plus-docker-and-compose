import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsOptional()
  @IsArray()
  itemsId: number[];
}
