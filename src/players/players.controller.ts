import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
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
  async find(): Promise<IPlayer[]> {
    const players: IPlayer[] = await this.playersService.find();
    return players
  }

  @Get()
  async findByEmail(@Query('email') email: string): Promise<IPlayer> {
    const player: IPlayer = await this.playersService.findByEmail(email);
   
    if (!player) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }
    return player
  }

  @Get('/:_id')
  async findById(@Param('_id') id: string): Promise<IPlayer> {
    const player: IPlayer = await this.playersService.findById(id);
    return player
  }

  @Delete()
  @HttpCode(204)
  async delete(@Query('email', PlayersParametersValidation) email: string): Promise<void> {
    await this.playersService.delete(email);
  }
}
