import { IsString, IsNumber } from 'class-validator';

export class CreateKeyDto {
  @IsString()
  key: string;

  @IsNumber()
  rpsLimit: number;
}
