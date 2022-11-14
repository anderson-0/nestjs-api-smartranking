import { IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ChallengeStatus } from '../challenge-status.enum';

export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateHourChallenge: Date;

  @IsOptional()
  status: ChallengeStatus
}