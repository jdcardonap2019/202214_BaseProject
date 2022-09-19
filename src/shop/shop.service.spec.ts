import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ShopEntity } from './shop.entity';
import { ShopService } from './shop.service';
import { faker } from '@faker-js/faker';

describe('ShopService', () => {
  let service: ShopService;
  let repository: Repository<ShopEntity>;
  let shopList = []


  const seedDatabase = async () => {
    repository.clear();
    shopList = [];
    for(let i = 0; i < 5; i++){
        const shop: ShopEntity = await repository.save({
        name: faker.company.name(),
        city: faker.datatype.string(3),
        direction: faker.address.street()})
        shopList.push(shop);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ShopService],
    }).compile();

    service = module.get<ShopService>(ShopService);
    repository = module.get<Repository<ShopEntity>>(getRepositoryToken(ShopEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('findAll should return all shops', async () => {
    const shops: ShopEntity[] = await service.findAll();
    expect(shops).not.toBeNull();
    expect(shops).toHaveLength(shopList.length);
  });
  
  it('findOne should return a shop by id', async () => {
    const storedshop: ShopEntity =shopList[0];
    const shop: ShopEntity = await service.findOne(storedshop.id);
    expect(shop).not.toBeNull();
    expect(shop.name).toEqual(storedshop.name)
    expect(shop.city).toEqual(storedshop.city)
    expect(shop.direction).toEqual(storedshop.direction)
  });
  
  it('findOne should throw an exception for an invalid shop', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", 'The shop with that id does not exists')
  });
  
  it('create should return a new shop', async () => {
    const shop: ShopEntity = {
      id: "",
      name: faker.company.name(),
      city: faker.datatype.string(3),
      direction: faker.address.street(),
      products: null
    }
  
    const newshop: ShopEntity = await service.create(shop);
    expect(newshop).not.toBeNull();
  
    const storedshop: ShopEntity = await repository.findOne({where: {id: newshop.id}})
    expect(storedshop).not.toBeNull();
    expect(storedshop.name).toEqual(newshop.name)
    expect(storedshop.city).toEqual(newshop.city)
    expect(storedshop.direction).toEqual(newshop.direction)
  });

  it('create shop without precondition should return error', async () => {
    const shop: ShopEntity = {
      id: "",
      name: faker.company.name(),
      city: faker.datatype.string(4),
      direction: faker.address.street(),
      products: null
    }

    await expect(() => service.create(shop)).rejects.toHaveProperty("message", 'The city of the shop must have a 3 character code')   
  });
  
  it('update should modify a shop', async () => {
    const shop: ShopEntity = shopList[0];
    shop.name = "New name";
    shop.direction = "New address";
    const updatedshop: ShopEntity = await service.update(shop.id, shop);
    expect(updatedshop).not.toBeNull();
    const storedshop: ShopEntity = await repository.findOne({ where: { id: shop.id } })
    expect(storedshop).not.toBeNull();
    expect(storedshop.name).toEqual(shop.name)
    expect(storedshop.direction).toEqual(shop.direction)
  });
  
  it('update should throw an exception for an invalid shop', async () => {
    let shop: ShopEntity = shopList[0];
    shop = {
      ...shop, name: "New name", direction: "New address"
    }
    await expect(() => service.update("0", shop)).rejects.toHaveProperty("message", 'The shop with that id does not exists')
  });
  
  it('delete should remove a shop', async () => {
    const shop: ShopEntity = shopList[0];
    await service.remove(shop.id);
     const deletedshop: ShopEntity = await repository.findOne({ where: { id: shop.id } })
    expect(deletedshop).toBeNull();
  });
  
  it('delete should throw an exception for an invalid shop', async () => {
    const shop: ShopEntity = shopList[0];
    await service.remove(shop.id);
    await expect(() => service.remove("0")).rejects.toHaveProperty("message", 'The shop with that id does not exists')
  });

});