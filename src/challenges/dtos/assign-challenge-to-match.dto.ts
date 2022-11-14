import { IsNotEmpty } from 'class-validator';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { IResult } from '../interfaces/challenge.interface';

export class AssignChallengeToMatchDto {

  @IsNotEmpty()
  def: IPlayer

  @IsNotEmpty()
  resultado: IResult[]
  
}
