import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { faker } from '@faker-js/faker';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productsList = []

  const seedDatabase = async () => {
   repository.clear();
   productsList = [];
   for(let i = 0; i < 5; i++){
       const product: ProductEntity = await repository.save({
       name: faker.company.name(),
       price: faker.datatype.number({min: 0, max: 100000}),
       type: "Perecedero"})
       productsList.push(product);
   }
 }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });
  
  it('findOne should return a product by id', async () => {
    const storedproduct: ProductEntity =productsList[0];
    const product: ProductEntity = await service.findOne(storedproduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedproduct.name)
    expect(product.price).toEqual(storedproduct.price)
    expect(product.type).toEqual(storedproduct.type)
  });
  
  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", 'The product with that id does not exists')
  });
  
  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: "",
      name: faker.company.name(),
      price: faker.datatype.number({min: 0, max: 100000}),
      type: "Perecedero",
      shops: null
    }
  
    const newproduct: ProductEntity = await service.create(product);
    expect(newproduct).not.toBeNull();
  
    const storedproduct: ProductEntity = await repository.findOne({where: {id: newproduct.id}})
    expect(storedproduct).not.toBeNull();
    expect(storedproduct.name).toEqual(newproduct.name)
    expect(storedproduct.price).toEqual(newproduct.price)
    expect(storedproduct.type).toEqual(newproduct.type)
  });

  it('create product without precondition should return error', async () => {
    const product: ProductEntity = {
      id: "",
      name: faker.company.name(),
      price: faker.datatype.number({min: 0, max: 100000}),
      type: "NULL",
      shops: null
    }

    await expect(() => service.create(product)).rejects.toHaveProperty("message", 'The type of the product must be Perecedero or No perecedero')
  });
  
  it('update should modify a product', async () => {
    const product: ProductEntity = productsList[0];
    product.name = "New name";
    product.type = "No perecedero";
    const updatedproduct: ProductEntity = await service.update(product.id, product);
    expect(updatedproduct).not.toBeNull();
    const storedproduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(storedproduct).not.toBeNull();
    expect(storedproduct.name).toEqual(product.name)
    expect(storedproduct.type).toEqual(product.type)
  });
  
  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productsList[0];
    product = {
      ...product, name: "New name", type: "No perecedero"
    }
    await expect(() => service.update("0", product)).rejects.toHaveProperty("message", 'The product with that id does not exists')
  });
  
  it('delete should remove a product', async () => {
    const product: ProductEntity = productsList[0];
    await service.remove(product.id);
     const deletedproduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(deletedproduct).toBeNull();
  });
  
  it('delete should throw an exception for an invalid product', async () => {
    const product: ProductEntity = productsList[0];
    await service.remove(product.id);
    await expect(() => service.remove("0")).rejects.toHaveProperty("message", 'The product with that id does not exists')
  });


});