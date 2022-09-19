import { Controller, UseInterceptors, Get, Param, Post, Body, Put, HttpCode, Delete } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ShopDto } from 'src/shop/shop.dto';
import { ShopEntity } from 'src/shop/shop.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductShopService } from './product-shop.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductShopController {
    constructor(private readonly ProductShopService: ProductShopService){}

    @Post(':productId/shops/:shopId')
    async addTiendaProduct(@Param('productId') productId: string, @Param('shopId') shopId: string){
    return await this.ProductShopService.addShopToProduct(productId, shopId);
    }

    @Get(':productId/shops/:shopId')
    async findTiendaByproductIdshopId(@Param('productId') productId: string, @Param('shopId') shopId: string){
    return await this.ProductShopService.findShopByproductIdShopId(productId, shopId);
    }

    @Get(':productId/shops')
    async findshopsByproductId(@Param('productId') productId: string){
    return await this.ProductShopService.findShopsByProductId(productId);
    }

    @Put(':productId/shops')
    async associateshopsProducto(@Body() shopsDto: ShopDto[], @Param('productId') productId: string){
    const shops = plainToInstance(ShopEntity, shopsDto)
    return await this.ProductShopService.associateShopsProduct(productId, shops);
    }

    @Delete(':productId/shops/:shopId')
    @HttpCode(204)
    async deleteTiendaProducto(@Param('productId') productId: string, @Param('shopId') shopId: string){
    return await this.ProductShopService.deleteShopProduct(productId, shopId);
    }
}
