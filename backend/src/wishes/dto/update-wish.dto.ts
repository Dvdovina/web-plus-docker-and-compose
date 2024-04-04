import {
  IsString,
  IsUrl,
  Length,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  price: number;

  @IsString()
  @IsOptional()
  @Length(1, 1024)
  description: string;
}
