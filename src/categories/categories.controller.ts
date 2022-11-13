import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ICategory } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    const { category } = createCategoryDto;
    const categoryModel = await this.categoriesService.findByCategory(category);

    if (categoryModel) {
      throw new BadRequestException(`Category ${category} already exists`);
    }
    return this.categoriesService.create(createCategoryDto);
  }
}
