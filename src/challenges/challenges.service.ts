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

        /*
        Verificar se os jogadores informados estão cadastrados
        */

        const players = await this.playersService.find()

        createChallengeDto.players.map(playerDto => {
            const playersFilter = players.filter( player => player._id === playerDto._id )

            if (playersFilter.length == 0) {
                throw new BadRequestException(`O id ${playerDto._id} não é um jogador!`)
            }
        
        })
          
        /*
        Verificar se o solicitante é um dos jogadores da partida
        */    

        const requesterIsPlayerInMatch = await createChallengeDto.players.filter(player => player._id == createChallengeDto.requester)

        this.logger.log(`requesterIsPlayerInMatch: ${requesterIsPlayerInMatch}`)

        if(requesterIsPlayerInMatch.length == 0) {
            throw new BadRequestException(`The requester must be a player in the match!`)
        }

        /*
        Descobrimos a category com base no ID do jogador solicitante
        */
        const playerCategory = await this.categoriesService.findPlayersCategory(createChallengeDto.requester)

        /*
        Para prosseguir o solicitante deve fazer parte de uma category
        */
        if (!playerCategory) {
            throw new BadRequestException(`O solicitante precisa estar registrado em uma category!`)
        }

        const desafioCriado = new this.challengeModel(createChallengeDto)
        desafioCriado.category = playerCategory.category
        desafioCriado.dateHourRequest = new Date()
        /*
        Quando um desafio for criado, definimos o status desafio como pendente
        */
        desafioCriado.status = ChallengeStatus.PENDING
        this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`)
        return await desafioCriado.save()

    }

    async find(): Promise<Array<IChallenge>> {
        return await this.challengeModel.find()
        .populate("requester")
        .populate("players")
        .populate("match")
        .exec()
    }

    async findPlayersChallenges(_id: any): Promise<Array<IChallenge>> {

       const jogadores = await this.playersService.find()

        const jogadorFilter = jogadores.filter( jogador => jogador._id == _id )

        if (jogadorFilter.length == 0) {
            throw new BadRequestException(`O id ${_id} não é um jogador!`)
        }

        return await this.challengeModel.find()
        .where('jogadores')
        .in(_id)
        .populate("solicitante")
        .populate("jogadores")
        .populate("partida")
        .exec()

    }

    async update(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
   
        const desafioEncontrado = await this.challengeModel.findById(_id).exec()

        if (!desafioEncontrado) {
            throw new NotFoundException(`Desafio ${_id} não cadastrado!`)
        }

        /*
        Atualizaremos a data da resposta quando o status do desafio vier preenchido 
        */
        if (updateChallengeDto.status){
           desafioEncontrado.dateHourResponse = new Date()         
        }
        desafioEncontrado.status = updateChallengeDto.status
        desafioEncontrado.dateHourChallenge = updateChallengeDto.dateHourChallenge

        await this.challengeModel.findOneAndUpdate({_id},{$set: desafioEncontrado}).exec()
        
    }

    async assignChallengeToMatch(_id: string, assignChallengeToMatchDto: AssignChallengeToMatchDto ): Promise<void> {

        const foundChallenge = await this.challengeModel.findById(_id).exec()
        
        if (!foundChallenge) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado!`)
        }

         /*
        Verificar se o jogador vencedor faz parte do desafio
        */
       const playerFilter = foundChallenge.players.filter(player => player._id === assignChallengeToMatchDto.def._id )

        this.logger.log(`foundChallenge: ${foundChallenge}`)
        this.logger.log(`playerFilter: ${playerFilter}`)

       if (playerFilter.length == 0) {
           throw new BadRequestException(`The winner is not part of the challenge!`)
       }

        /*
        Primeiro vamos criar e persistir o objeto partida
        */
       const createdMatch = new this.matchModel(assignChallengeToMatchDto)

       /*
       Atribuir ao objeto partida a category recuperada no desafio
       */
       createdMatch.category = foundChallenge.category

       /*
       Atribuir ao objeto partida os jogadores que fizeram parte do desafio
       */
       createdMatch.players = foundChallenge.players

       const result = await createdMatch.save()
       
        /*
        Whenever a match is registered by a user, we change the status to EXECUTED
        */
        foundChallenge.status = ChallengeStatus.EXECUTED

        /*  
        Recover ID of the match and assign to the challenge
        */
        foundChallenge.match = result

        try {
        await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec() 
        } catch (error) {
            /*
            Se a atualização do desafio falhar excluímos a partida 
            gravada anteriormente
            */
           await this.matchModel.deleteOne({_id: result._id}).exec();
           throw new InternalServerErrorException()
        }
    }

    async delete(_id: string): Promise<void> {

        const foundChallenge = await this.challengeModel.findById(_id).exec()

        if (!foundChallenge) {
            throw new BadRequestException(`Challenge ${_id} not found!`)
        }
        
        /*
        Realizaremos a deleção lógica do desafio, modificando seu status para
        CANCELED
        */
       foundChallenge.status = ChallengeStatus.CANCELED

       await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec() 

    }

}
