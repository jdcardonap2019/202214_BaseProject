import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './product/product.module';
import { TiendaModule } from './shop/shop.module';
import { ProductShopModule } from './product-shop/product-shop.module';

@Module({
  imports: [ProductoModule, TiendaModule, ProductShopModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
