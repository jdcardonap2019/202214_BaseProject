import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../product/product.entity';
import { ShopEntity } from '../../shop/shop.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [ProductEntity, ShopEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([ProductEntity, ShopEntity]),
];