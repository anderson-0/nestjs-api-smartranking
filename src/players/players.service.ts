import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(@InjectModel('Player') private readonly playerModel: Model<IPlayer>) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
    const playerModel = new this.playerModel(createPlayerDto)
    const player = await playerModel.save()
    
    this.logger.log(`Saved Player: ${JSON.stringify(player)}`);
    return player;
  }

  async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
    await this.playerModel.findOneAndUpdate(
      { _id },
      { $set: updatePlayerDto },).exec();
  }

  async find(): Promise<IPlayer[]> {
    return this.playerModel.find().exec();
  }

  async findByEmail(email: string): Promise<IPlayer> {
    return this.playerModel.findOne({ email }).exec()
  }

  async findById(_id: string): Promise<IPlayer> {
    if(!ObjectId.isValid(_id)) throw new Error('Invalid ID');
    return this.playerModel.findById({_id}).exec();
  }

  async delete(_id: string): Promise<void> {
    await this.playerModel.findOneAndDelete({ _id }).exec();
  }

  

}
