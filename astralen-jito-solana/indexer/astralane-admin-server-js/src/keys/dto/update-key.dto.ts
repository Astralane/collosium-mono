import { IsNumber } from 'class-validator';

export class UpdateKeyDto {
  @IsNumber()
  rpsLimit: number;
}
