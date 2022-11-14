import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  BadRequestException,
  Query,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ParametersValidationPipe } from 'src/common/pipes/parameters-validation.pipe';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() criarJogadorDto: CreatePlayerDto): Promise<IPlayer> {
    const { email } = criarJogadorDto;
    const player: IPlayer = await this.playersService.findByEmail(email);
    if (player) {
      throw new BadRequestException('Player already exists');
    }
    return this.playersService.create(criarJogadorDto);
  }

  @Put('/:_id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) //removes unnecessary fields from the request body
  async update(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ParametersValidationPipe) _id: string): Promise<void> {
    await this.playersService.update(_id, updatePlayerDto);
  }

  @Get()
  async find(@Query('email') email: string): Promise<IPlayer | IPlayer[]> {
    if (!email) {
      return this.playersService.find();
    }
    const player: IPlayer = await this.playersService.findByEmail(email);
    if (!player) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }
    return player
  }

  @Get('/:_id')
  async findById(@Param('_id') _id: string): Promise<IPlayer> {
    try {
      return await this.playersService.findById(_id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(`/:_id`)
  @HttpCode(204)
  async delete(@Param('_id', ParametersValidationPipe) _id: string): Promise<void> {
    await this.playersService.delete(_id);
  }
}
