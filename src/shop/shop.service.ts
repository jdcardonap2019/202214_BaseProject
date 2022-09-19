import { Injectable } from '@nestjs/common';
import { ShopEntity } from './shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/business-errors/business-errors'


@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(ShopEntity)
        private readonly shopRepository: Repository<ShopEntity>
    ){}
    async findAll() {
        return await this.shopRepository.find({
          relations: ['products'],
        });
      }

      async findOne(id: string): Promise<ShopEntity> {
        const shop: ShopEntity = await this.shopRepository.findOne({
          where: { id },
          relations: ['products'],});
        if (!shop)
          throw new BusinessLogicException(
            'The shop with that id does not exists', BusinessError.NOT_FOUND);
        return shop;
      }

      async create(shop: ShopEntity): Promise<ShopEntity> {
        if(shop.city.length != 3) {
            throw new BusinessLogicException(
                'The city of the shop must have a 3 character code', BusinessError.PRECONDITION_FAILED);
        }
        return await this.shopRepository.save(shop);
      }

      async update(id: string, shop: ShopEntity): Promise<ShopEntity> {
        const persistedshop: ShopEntity = await this.shopRepository.findOne({ where: { id }});
        if (!persistedshop)
          throw new BusinessLogicException('The shop with that id does not exists',BusinessError.NOT_FOUND);
          
        if(shop.city.length != 3) {
            throw new BusinessLogicException(
                'The city of the shop must have a 3 character code', BusinessError.PRECONDITION_FAILED);
        }
        return await this.shopRepository.save({...persistedshop, ...shop,});
      }

      async remove(id: string) {
        const shop: ShopEntity = await this.shopRepository.findOne({where: { id }});
        if (!shop)
          throw new BusinessLogicException('The shop with that id does not exists', BusinessError.NOT_FOUND);
    
        await this.shopRepository.remove(shop);
      }
}
