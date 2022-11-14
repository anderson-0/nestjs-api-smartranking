import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssignChallengeToMatchDto } from './dtos/assign-challenge-to-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('challenges')
export class ChallengesController {
  private readonly logger = new Logger(ChallengesController.name)
  
  constructor(private readonly challengesService: ChallengesService){}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
      @Body() createChallengeDto: CreateChallengeDto): Promise<IChallenge> {
          this.logger.log(`criarDesafioDto: ${JSON.stringify(createChallengeDto)}`)
          return await this.challengesService.create(createChallengeDto)
  }
  
  @Get()
  async find(
      @Query('idPlayer') _id: string): Promise<Array<IChallenge>> {
      return _id ? await this.challengesService.findPlayersChallenges(_id) 
      : await this.challengesService.find()
  }

  @Put('/:desafio')
  async update(
      @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
      @Param('challenge') _id: string): Promise<void> {
          await this.challengesService.update(_id, updateChallengeDto)

      }    

  @Post('/:challenge/match/')
  async assignChallengeToMatch(
      @Body(ValidationPipe) assignChallengeToMatchDto: AssignChallengeToMatchDto,
      @Param('desafio') _id: string): Promise<void> {
      return await this.challengesService.assignChallengeToMatch(_id, assignChallengeToMatchDto)           
  }

  @Delete('/:_id')
  async delete(
      @Param('_id') _id: string): Promise<void> {
          await this.challengesService.delete(_id)
  }

}
