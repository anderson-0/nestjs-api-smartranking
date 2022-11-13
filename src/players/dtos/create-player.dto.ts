import { IsNotEmpty, IsEmail } from 'class-validator'

export class CreatePlayerDto {

  @IsNotEmpty()
  readonly phoneNumber: string;
  
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  
  @IsNotEmpty()
  readonly name: string;
}