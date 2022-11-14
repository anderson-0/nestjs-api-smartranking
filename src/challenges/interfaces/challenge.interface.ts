import { IPlayer } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from '../challenge-status.enum';

export interface IChallenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse: Date;
  requester: IPlayer;
  category: string;
  players: IPlayer[];
  match: IMatch;
}

export interface IMatch {
  players: IPlayer[];
  category: string;
  def: IPlayer;
  result: IResult[];
}

export interface IResult {
  set: string;
}