import {IsNotEmpty, IsString} from 'class-validator';

export class ShopDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly city: string;
 
 @IsString()
 @IsNotEmpty()
 readonly direction: string;
}
