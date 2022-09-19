import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { BusinessError, BusinessLogicException } from '../shared/business-errors/business-errors'

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ){}
    async findAll() {
        return await this.productRepository.find({
          relations: ['shops'],
        });
      }

      async findOne(id: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({
          where: { id },
          relations: ['shops'],});
        if (!product)
          throw new BusinessLogicException(
            'The product with that id does not exists', BusinessError.NOT_FOUND);
        return product;
      }

      async create(product: ProductEntity): Promise<ProductEntity> {
        if(product.type != 'Perecedero' && product.type != 'No perecedero') {
            throw new BusinessLogicException(
                'The type of the product must be Perecedero or No perecedero', BusinessError.PRECONDITION_FAILED);
        }
        return await this.productRepository.save(product);
      }

      async update(id: string, product: ProductEntity): Promise<ProductEntity> {
        const persistedproduct: ProductEntity = await this.productRepository.findOne({ where: { id }});
        if (!persistedproduct)
          throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND);
          
        if(product.type != 'Perecedero' && product.type != 'No perecedero') {
            throw new BusinessLogicException(
                'The type of the product must be Perecedero or No perecedero', BusinessError.PRECONDITION_FAILED);
        }
        return await this.productRepository.save({...persistedproduct, ...product,});
      }

      async remove(id: string) {
        const product: ProductEntity = await this.productRepository.findOne({where: { id }});
        if (!product)
          throw new BusinessLogicException('The product with that id does not exists', BusinessError.NOT_FOUND);
    
        await this.productRepository.remove(product);
      }
}
