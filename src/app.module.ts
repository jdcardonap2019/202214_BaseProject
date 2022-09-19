import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
import { ProductShopModule } from './product-shop/product-shop.module';
import { ProductEntity } from './product/product.entity';
import { ShopEntity } from './shop/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ProductModule, ShopModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'p2',
    entities: [ProductEntity, ShopEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),ProductShopModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
