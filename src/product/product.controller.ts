import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor'
import { ProductDto } from '../product/product.dto'
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from './product.entity';

@Controller('product')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Get()
    async findAll() {
        return await this.productService.findAll();
    }

    @Get(':productId')
    async findOne(@Param('productId') productId: string) {
        return await this.productService.findOne(productId);
    }

    @Post()
    async create(@Body() ProductDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, ProductDto);
    return await this.productService.create(product);
    }

    @Put(':productId')
    async update(@Param('productId') productId: string, @Body() ProductDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, ProductDto);
    return await this.productService.update(productId, product);
    }

    @Delete(':productId')
    @HttpCode(204)
    async delete(@Param('productId') productId: string) {
      return await this.productService.remove(productId);
    }
}
