import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { PlayersParametersValidation } from './pipes/players-parameters-validation.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async upsert(@Body() criarJogadorDto: CreatePlayerDto): Promise<any> {
    await this.playersService.upsert(criarJogadorDto);
  }

  @Get()
  async find(@Query('email') email: string): Promise<IPlayer[]> {
    let players: IPlayer[] = []
    if (email) {
      players = await this.playersService.findByEmail(email);
    }
    players = await this.playersService.find();

    if (players.length === 0) {
      throw new HttpException('No players found', HttpStatus.NOT_FOUND);
    }
    return players
  }

  @Delete()
  @HttpCode(204)
  async delete(@Query('email', PlayersParametersValidation) email: string): Promise<void> {
    await this.playersService.delete(email);
  }
}
