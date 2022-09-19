import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { ProductShopService } from './product-shop.service';
import { ShopEntity } from '../shop/shop.entity';
import { ProductShopController } from './product-shop.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ShopEntity])],
 providers: [ProductShopService],
 controllers: [ProductShopController],
})
export class ProductShopModule {}
