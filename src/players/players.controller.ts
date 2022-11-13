import { Body, Controller, Delete, Get, HttpCode, Post, Query } from '@nestjs/common';
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
  async find(@Query('email') email: string): Promise<IPlayer[]> {
    if (email) {
      return this.playersService.findByEmail(email);
    }
    return this.playersService.find();
  }

  @Delete()
  @HttpCode(204)
  async delete(@Query('email') email: string): Promise<void> {
    await this.playersService.delete(email);
  }
}
