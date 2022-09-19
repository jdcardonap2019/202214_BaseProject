import { ProductEntity } from "../product/product.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShopEntity {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   name: string;

   @Column()
   city: string;
 
   @Column()
   direction: string;

   @ManyToMany(() => ProductEntity, product => product.shops)
   products: ProductEntity[];
}