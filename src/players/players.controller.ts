import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async upsert(@Body() criarJogadorDto: CreatePlayerDto): Promise<any> {
    await this.playersService.upsert(criarJogadorDto);
  }

  @Get()
  async find(): Promise<IPlayer[]> {
    return this.playersService.find();
  }
}
