import { Body, Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ICategory } from './interfaces/category.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    return await this.categoriesService.create(createCategoryDto);
  }
}
