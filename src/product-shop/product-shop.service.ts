import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { Repository } from 'typeorm';
import { ShopEntity } from '../shop/shop.entity';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/business-errors/business-errors';

@Injectable()
export class ProductShopService {
  constructor(
       @InjectRepository(ProductEntity)
       private readonly productRepository: Repository<ProductEntity>,
   
       @InjectRepository(ShopEntity)
       private readonly shopRepository: Repository<ShopEntity>
   ) {}


   async addShopToProduct(productId: string, shopId: string): Promise<ProductEntity> {
    const shop: ShopEntity = await this.shopRepository.findOne({where: {id: shopId}});
    if (!shop)
      throw new BusinessLogicException('The shop with that id does not exists', BusinessError.NOT_FOUND);
  
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["shops"]})
    if (!product)
      throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND);

    product.shops = [...product.shops, shop];
    return await this.productRepository.save(product);
  }

async findShopByproductIdShopId(productId: string, shopId: string): Promise<ShopEntity> {
    const shop: ShopEntity = await this.shopRepository.findOne({where: {id: shopId}});
    if (!shop)
      throw new BusinessLogicException('The shop with that id does not exists', BusinessError.NOT_FOUND)
   
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["shops"]});
    if (!product)
      throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND)

    const shopproduct: ShopEntity = product.shops.find(e => e.id === shop.id);

    if (!shopproduct)
      throw new BusinessLogicException('The shop with that id is not associated to that product', BusinessError.PRECONDITION_FAILED)

    return shopproduct;
}

async findShopsByProductId(productId: string): Promise<ShopEntity[]> {
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["shops"]});
    if (!product)
      throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND)
   
    return product.shops;
}

async associateShopsProduct(productId: string, shops: ShopEntity[]): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["shops"]});
    if (!product)
      throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND)

    for (let i = 0; i < shops.length; i++) {
      const shop: ShopEntity = await this.shopRepository.findOne({where: {id: shops[i].id}});
      if (!shop)
        throw new BusinessLogicException("The shop with that id does not exists", BusinessError.NOT_FOUND)
    }
    product.shops = shops;
    return await this.productRepository.save(product);
}

async deleteShopProduct(productId: string, shopId: string){
    const shop: ShopEntity = await this.shopRepository.findOne({where: {id: shopId}});
    if (!shop)
      throw new BusinessLogicException("The shop with that id does not exists", BusinessError.NOT_FOUND)

    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["shops"]});
    if (!product)
      throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND)

    const shopproduct: ShopEntity = product.shops.find(e => e.id === shop.id);

    if (!shopproduct)
        throw new BusinessLogicException('The shop with that id is not associated to that product', BusinessError.PRECONDITION_FAILED)

    product.shops = product.shops.filter(e => e.id !== shopId);
    await this.productRepository.save(product);
}  
}
