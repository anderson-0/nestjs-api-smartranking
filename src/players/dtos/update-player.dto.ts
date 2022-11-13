import { IsNotEmpty, IsEmail } from 'class-validator'

export class UpdatePlayerDto {

  @IsNotEmpty()
  readonly phoneNumber: string;
  
  @IsNotEmpty()
  readonly name: string;
}