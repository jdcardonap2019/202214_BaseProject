import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductShopService } from './product-shop.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from '../product/product.entity';
import { ShopEntity } from '../shop/shop.entity';
import { faker } from '@faker-js/faker';

describe('ProductShopService', () => {
  let service: ProductShopService;
  let productRepository: Repository<ProductEntity>;
  let shopRepository: Repository<ShopEntity>;
  let product: ProductEntity;
  let shopList : ShopEntity[];

  const seedDatabase = async () => {
    shopRepository.clear();
    productRepository.clear();
 
    shopList = [];
    for(let i = 0; i < 5; i++){
      const shop: ShopEntity = await shopRepository.save({
      name: faker.company.name(),
      city: faker.datatype.string(3),
      direction: faker.address.street()})
      shopList.push(shop);
  }

    product = await productRepository.save({
    name: faker.company.name(),
    price: faker.datatype.number({min: 0, max: 100000}),
    type: "Perecedero",
    shops: shopList});
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductShopService],
    }).compile();

    service = module.get<ProductShopService>(ProductShopService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    shopRepository = module.get<Repository<ShopEntity>>(getRepositoryToken(ShopEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addShopToProduct should add a shop to a product', async () => {
    const newshop: ShopEntity = await shopRepository.save({
        name: 'shop X',
        city: 'abc',
        direction: 'direction X'
    });

    const newproduct: ProductEntity = await productRepository.save({
      name: 'product X',
      price: 10,
      type: 'Perecedero'
    })

    const result: ProductEntity = await service.addShopToProduct(newproduct.id, newshop.id);
   expect(result.shops.length).toBe(1);
   expect(result.shops[0]).not.toBeNull();
   expect(result.shops[0].name).toBe(newshop.name)
   expect(result.shops[0].city).toBe(newshop.city)
   expect(result.shops[0].direction).toBe(newshop.direction)
  });

  it('addShopToProduct should thrown exception for an invalid shop', async () => {
    const newproduct: ProductEntity = await productRepository.save({
      name: 'product X',
      price: 10,
      type: 'Perecedero'
    })
 
    await expect(() => service.addShopToProduct(newproduct.id, "0")).rejects.toHaveProperty("message", 'The shop with that id does not exists');
  });

  it('addShopToProduct should throw an exception for an invalid product', async () => {
    const newshop: ShopEntity = await shopRepository.save({
      name: 'shop X',
      city: 'abc',
      direction: 'direction X'
  });
 
    await expect(() => service.addShopToProduct("0", newshop.id)).rejects.toHaveProperty("message", 'The product with that id does not exists');
  });

  it('findShopByproductIdShopId should return shop by product', async () => {
    const shop: ShopEntity = shopList[0];
    const storedshop: ShopEntity = await service.findShopByproductIdShopId(product.id, shop.id, )
    expect(storedshop).not.toBeNull();
    expect(storedshop.name).toBe(shop.name);
    expect(storedshop.city).toBe(shop.city);
    expect(storedshop.direction).toBe(shop.direction);
  });

  it('findShopByproductIdShopId should throw an exception for an invalid shop', async () => {
    await expect(()=> service.findShopByproductIdShopId(product.id, "0")).rejects.toHaveProperty("message", 'The shop with that id does not exists');
  });

  it('findShopByproductIdShopId should throw an exception for an invalid product', async () => {
    const shop: ShopEntity = shopList[0];
    await expect(()=> service.findShopByproductIdShopId("0", shop.id)).rejects.toHaveProperty("message", 'The product with that id does not exists');
  });

  it('findShopByproductIdShopId should throw an exception for a shop not associated to a product', async () => {
    const newshop: ShopEntity = await shopRepository.save({
      name: 'shop X',
      city: 'abc',
      direction: 'direction X'
    });
 
    await expect(()=> service.findShopByproductIdShopId(product.id, newshop.id)).rejects.toHaveProperty("message", 'The shop with that id is not associated to that product');
  });

  it('findShopsByProductId should return shops by product', async ()=>{
    const shops: ShopEntity[] = await service.findShopsByProductId(product.id);
    expect(shops.length).toBe(5)
  });

  it('findShopsByProductId should throw an exception for an invalid product', async () => {
    await expect(()=> service.findShopsByProductId("0")).rejects.toHaveProperty("message", 'The product with that id does not exists');
  });

  it('associateShopsProduct should update shops list for a product', async () => {
    const newshop: ShopEntity = await shopRepository.save({
      name: 'shop Y',
      city: 'abc',
      direction: 'direction Y'
    });
 
    const updatedproduct: ProductEntity = await service.associateShopsProduct(product.id, [newshop]);
    expect(updatedproduct.shops.length).toBe(1);
    expect(updatedproduct.shops[0].name).toBe(newshop.name);
    expect(updatedproduct.shops[0].city).toBe(newshop.city);
    expect(updatedproduct.shops[0].direction).toBe(newshop.direction);
  });

  it('associateShopsProduct should throw an exception for an invalid product', async () => {
    const newshop: ShopEntity = await shopRepository.save({
      name: 'shop Y',
      city: 'abc',
      direction: 'direction Y'
    });
 
    await expect(()=> service.associateShopsProduct("0", [newshop])).rejects.toHaveProperty("message", 'The product with that id does not exists');
  });

  it('associateShopsProduct should throw an exception for an invalid shop', async () => {
    const newshop: ShopEntity = shopList[0];
    newshop.id = "0";
 
    await expect(()=> service.associateShopsProduct(product.id, [newshop])).rejects.toHaveProperty("message", 'The shop with that id does not exists');
  });

  it('deleteShopCulture should remove a shop from a product', async () => {
    const shop: ShopEntity = shopList[0];
   
    await service.deleteShopProduct(product.id, shop.id);
 
    const storedproduct: ProductEntity = await productRepository.findOne({where: {id: product.id}, relations: ["shops"]});
    const deletedshop: ShopEntity = storedproduct.shops.find(a => a.id === shop.id);
 
    expect(deletedshop).toBeUndefined();
  });

  it('deleteShopCulture should thrown an exception for an invalid shop', async () => {
    await expect(()=> service.deleteShopProduct(product.id, "0")).rejects.toHaveProperty("message", 'The shop with that id does not exists');
  });

  it('deleteShopCulture should thrown an exception for an invalid product', async () => {
    const shop: ShopEntity = shopList[0];
    await expect(()=> service.deleteShopProduct("0", shop.id)).rejects.toHaveProperty("message", 'The product with that id does not exists');
  });

  it('deleteShopCulture should thrown an exception for a non asocciated shop', async () => {
    const newshop:ShopEntity = await shopRepository.save({
      name: 'shop Y',
      city: 'abc',
      direction: 'direction Y'
    });
 
    await expect(()=> service.deleteShopProduct(product.id, newshop.id)).rejects.toHaveProperty("message", 'The shop with that id is not associated to that product');
  });
});
