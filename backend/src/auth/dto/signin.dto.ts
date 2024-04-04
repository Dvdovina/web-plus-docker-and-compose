import { IsString, MinLength } from 'class-validator';

export class SigninDto {
  @MinLength(4)
  @IsString()
  username: string;

  @MinLength(4)
  @IsString()
  password: string;
}
