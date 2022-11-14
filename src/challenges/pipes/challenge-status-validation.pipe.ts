import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
