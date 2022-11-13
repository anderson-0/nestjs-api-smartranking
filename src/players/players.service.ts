import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: IPlayer[] = [];

  async upsert(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { name } = createPlayerDto;

    const playerFound = this.players.find((player) => player.name === name);
    if (playerFound) {
      this.update(playerFound, createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async find(): Promise<IPlayer[]> {
    return this.players;
  }

  async findByEmail(email: string): Promise<IPlayer[]> {
    return this.players.filter((player) => player.email === email);
  }

  private update(player: IPlayer, createPlayerDto: CreatePlayerDto): void {
    const { name } = createPlayerDto;
    player.name = name;
    this.players = [...this.players.filter((player) => player.name !== name), player];
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, email, phoneNumber } = createPlayerDto;
    const player: IPlayer = {
      _id: uuidv4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: 1,
      urlPhoto: 'http://google.com',
    };
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);
    this.players.push(player);
  }
}
