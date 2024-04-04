import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Req,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    try {
      return await this.wishlistsService.create(req.user, createWishlistDto);
    } catch (err) {
      console.log(err);
    }
  }

  @Get()
  async findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: any,
  ) {
    return this.wishlistsService.updateOne(id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return await this.wishlistsService.removeOne(req.user.id, +id);
  }
}
