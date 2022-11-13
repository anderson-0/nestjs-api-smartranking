import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: IPlayer[] = [];

  constructor(@InjectModel('Player') private readonly playerModel: Model<IPlayer>) {}

  async upsert(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const playerFound = await this.playerModel.findOne({ email }).exec();
    
    if (playerFound) {
      this.update(createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async find(): Promise<IPlayer[]> {
    return this.playerModel.find().exec();
  }

  async findByEmail(email: string): Promise<IPlayer> {
    return this.playerModel.findOne({ email }).exec()
  }

  async findById(_id: string): Promise<IPlayer> {
    return this.playerModel.findById({_id}).exec();
  }

  async delete(email: string): Promise<void> {
    await this.playerModel.findOneAndDelete({ email }).exec();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
    const { email } = createPlayerDto;
    return this.playerModel.findOneAndUpdate(
      { email },
      { $set: createPlayerDto },).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
    const playerModel = new this.playerModel(createPlayerDto)
    const player = await playerModel.save()
    
    this.logger.log(`Saved Player: ${JSON.stringify(player)}`);
    return player;
  }
}
