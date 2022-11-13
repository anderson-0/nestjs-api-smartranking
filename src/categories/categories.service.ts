import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ICategory } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor() {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    return null
  }
}
