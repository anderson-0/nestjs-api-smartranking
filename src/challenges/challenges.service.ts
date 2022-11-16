import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { ChallengeStatus } from './challenge-status.enum';
import { AssignChallengeToMatchDto } from './dtos/assign-challenge-to-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { IChallenge, IMatch } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<IChallenge>,
    @InjectModel('Match') private readonly matchModel: Model<IMatch>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService) {}

    private readonly logger = new Logger(ChallengesService.name)

  async create(createChallengeDto: CreateChallengeDto): Promise<IChallenge> {
    // Check if players exist
    const players = await this.playersService.find()

    createChallengeDto.players.map(playerDto => {
      const playersFilter = players.filter( player => player._id.toString() === playerDto._id.toString() )

      if (playersFilter.length === 0) {
        throw new BadRequestException(`ID ${playerDto._id} is not a player!`)
      }
    })

    // Check if requester is part of the challenge
    const requesterIsPlayerInMatch = createChallengeDto.players.filter(player => player._id.toString() == createChallengeDto.requester)

    this.logger.log(`requesterIsPlayerInMatch: ${requesterIsPlayerInMatch}`)

    if(requesterIsPlayerInMatch.length === 0) {
      throw new BadRequestException(`The requester must be a player in the match!`)
    }

    // Find category based on the requester's ID    
    const playerCategory = await this.categoriesService.findPlayersCategory(createChallengeDto.requester)

    // The requester must be in a category
    if (!playerCategory) {
      throw new BadRequestException(`The requester must be in a category!`)
    }

    const createdChallenge = new this.challengeModel(createChallengeDto)
    createdChallenge.category = playerCategory.category
    createdChallenge.dateHourChallenge = new Date()

    // When a challenge is created, it must have a PENDING status
    createdChallenge.status = ChallengeStatus.PENDING
    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`)
    return await createdChallenge.save()
  }

  async find(): Promise<IChallenge[]> {
    return await this.challengeModel.find()
    .populate("requester")
    .populate("players")
    .populate("match")
    .exec()
  }

  async findPlayersChallenges(_id: any): Promise<IChallenge[]> {
    const players = await this.playersService.find()
    const playerFilter = players.filter(player => player._id.toString() === _id.toString())

    if (playerFilter.length == 0) {
      throw new BadRequestException(`ID ${_id} is not a player!`)
    }

    return await this.challengeModel.find()
    .where('players')
    .in(_id)
    .populate("requester")
    .populate("players")
    .populate("match")
    .exec()
  }

  async update(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) {
      throw new NotFoundException(`Challenge ${_id} not found!`)
    }

    // We update the response date and time when the challenge has a status
    if (updateChallengeDto.status){
       foundChallenge.dateHourResponse = new Date()     
    }

    foundChallenge.status = updateChallengeDto.status
    foundChallenge.dateHourChallenge = updateChallengeDto.dateHourChallenge

    await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec()
  }

  async assignChallengeToMatch(_id: string, assignChallengeToMatchDto: AssignChallengeToMatchDto ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not found!`)
    }

    // Check if player is part of the challenge
    const playerFilter = foundChallenge.players.filter(player => player._id.toString() === assignChallengeToMatchDto.def.toString())

    this.logger.log(`foundChallenge: ${foundChallenge}`)
    this.logger.log(`playerFilter: ${playerFilter}`)

    if (playerFilter.length == 0) {
        throw new BadRequestException(`The winner is not part of the challenge!`)
    }

    const createdMatch = new this.matchModel(assignChallengeToMatchDto)
     // Assign to match object the category obtained from the challenge
     createdMatch.category = foundChallenge.category

     // Assigns players to match object
     createdMatch.players = foundChallenge.players

     const result = await createdMatch.save()
     
    // Whenever a match is registered by a user, we change the status to EXECUTED
    foundChallenge.status = ChallengeStatus.EXECUTED
 
    // Recover ID of the match and assign to the challenge
    foundChallenge.match = result

    try {
    await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec() 
    } catch (error) {
      // If the update fails we exclude the previously saved match
      await this.matchModel.deleteOne({_id: result._id}).exec();
      throw new InternalServerErrorException()
    }
  }

  async delete(_id: string): Promise<void> {

    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not found!`)
    }
    
    // Challenge Logical deletion by modifying the status to CANCELED
    foundChallenge.status = ChallengeStatus.CANCELED

    await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec() 
  }

}
