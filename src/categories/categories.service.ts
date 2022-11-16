import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ICategory } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
    private readonly playersService: PlayersService
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const { category } = createCategoryDto;
    const foundCategory = await this.findByCategory(category);

    if (foundCategory) {
      throw new Error(`Category ${category} already exists`);
    }
    const categoryModel = new this.categoryModel(createCategoryDto)
    const savedCategory = await categoryModel.save()
    
    return savedCategory;
  }

  async update(category: string, updateCategoryDto: UpdateCategoryDto): Promise<ICategory> {
    const categoryModel = await this.findByCategory(category);
    if (!categoryModel) {
      throw new Error(`Category ${category} not found`);
    }
    
    const updatedCategory = await this.categoryModel.findOneAndUpdate({ category }, {
      $set: updateCategoryDto
    }, {new: true}).exec();

    return updatedCategory;
  }

  async addPlayerToCategory(category: string, playerId: string): Promise<ICategory> {
    const foundCategory = await this.findByCategory(category);
    if (!foundCategory) {
      throw new Error(`Category ${category} not found`);
    }

    const player = await this.playersService.findById(playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    const playerAlreadyInCategory = foundCategory.players.find(player => player._id === playerId);
    if (playerAlreadyInCategory) {
      throw new Error(`Player ${playerId} already in category ${category}`);
    }

    foundCategory.players.push(player);
    const updatedCategory = await this.categoryModel.findOneAndUpdate({ category }, {
      $set: foundCategory
      }, {new: true}).exec();
    return updatedCategory
  }

  async find(): Promise<ICategory[]> {
    return this.categoryModel.find().exec();
  }

  async findById(_id: string): Promise<ICategory> {
    if(!ObjectId.isValid(_id)) throw new Error('Invalid ID');
    return this.categoryModel.findById({_id}).exec();
  }

  async findByCategory(category: string): Promise<ICategory | null> {
    return this.categoryModel.findOne({ category }).exec();
  }

  async findPlayersCategory(idPlayer: any): Promise<ICategory> {
    const playerId = await this.playersService.findById(idPlayer)                                   

    if (!playerId) {
      throw new BadRequestException(`ID ${idPlayer} is not a player!`)
    }

    return await this.categoryModel.findOne().where('players').in(idPlayer).exec() 
  }

}
