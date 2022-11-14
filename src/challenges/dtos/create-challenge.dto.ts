import { IsNotEmpty, IsDateString } from 'class-validator';
import { IPlayer } from 'src/players/interfaces/player.interface';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateHourChallenge: Date;

  @IsNotEmpty()
  requester: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  players: Array<IPlayer>;
}