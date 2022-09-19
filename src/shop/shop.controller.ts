import { ShopService } from './shop.service';
import { Controller, UseInterceptors, Get, Param, Post, Body, Put, HttpCode, Delete } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ShopDto } from './shop.dto';
import { ShopEntity } from './shop.entity';
import { plainToInstance } from 'class-transformer';

@Controller('shops')
@UseInterceptors(BusinessErrorsInterceptor)
export class ShopController {

    constructor(private readonly shopService: ShopService) {}

    @Get()
    async findAll() {
        return await this.shopService.findAll();
    }

    @Get(':shopId')
    async findOne(@Param('shopId') shopId: string) {
        return await this.shopService.findOne(shopId);
    }

    @Post()
    async create(@Body()ShopDto: ShopDto) {
    const shop: ShopEntity = plainToInstance(ShopEntity, ShopDto);
    return await this.shopService.create(shop);
    }

    @Put(':shopId')
    async update(@Param('shopId') shopId: string, @Body() ShopDto: ShopDto) {
    const product: ShopEntity = plainToInstance(ShopEntity, ShopDto);
    return await this.shopService.update(shopId, product);
    }

    @Delete(':shopId')
    @HttpCode(204)
    async delete(@Param('shopId') shopId: string) {
      return await this.shopService.remove(shopId);
    }
}
