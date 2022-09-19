import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { ShopEntity } from "../shop/shop.entity";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    price: number;
    
    @Column()
    type: string;

    @ManyToMany(() => ShopEntity, shop => shop.products)
    @JoinTable()
    shops: ShopEntity[];
}
