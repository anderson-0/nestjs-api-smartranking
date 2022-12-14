import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParametersValidationPipe } from 'src/common/pipes/parameters-validation.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ICategory } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {

    try {
      return await this.categoriesService.create(createCategoryDto);  
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    
  }

  @Get()
  async find(): Promise<ICategory[]> {
    return this.categoriesService.find();
  }

  @Get('/:_id')
  async findById(@Param('_id') _id: string): Promise<ICategory> {
    try {
      return await this.categoriesService.findById(_id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/:category')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) //removes unnecessary fields from the request body
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category', ParametersValidationPipe) category: string): Promise<ICategory> {
    try {
      return await this.categoriesService.update(category, updateCategoryDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/:category/players/:playerId')
  @HttpCode(200)
  async addPlayerToCategory(
    @Param('category', ParametersValidationPipe) category: string,
    @Param('playerId', ParametersValidationPipe) playerId: string,
  ): Promise<ICategory> {
    
    try {
      return await this.categoriesService.addPlayerToCategory(category, playerId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
