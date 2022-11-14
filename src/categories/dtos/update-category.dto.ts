import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IEvent } from '../interfaces/category.interface';

export class UpdateCategoryDto {

  @IsString()
  @IsOptional()
  readonly description: string;
  
  @IsArray()
  @ArrayMinSize(1)
  readonly events: Array<IEvent>;
}