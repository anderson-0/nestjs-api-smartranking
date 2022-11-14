import { IPlayer } from 'src/players/interfaces/player.interface';

export interface ICategory extends Document {
  readonly category: string;
  description: string;
  events: Event[];
  players: IPlayer[];
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}