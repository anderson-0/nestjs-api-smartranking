import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ICategory } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const categoryModel = new this.categoryModel(createCategoryDto)
    const category = await categoryModel.save()
    
    this.logger.log(`Saved Category: ${JSON.stringify(category)}`);
    return category;
  }

  async findByCategory(category: string): Promise<ICategory | undefined> {
    return this.categoryModel.findOne({ category }).exec();
  }
}
