import { IsString } from 'class-validator';

export class SymbolDto {
  @IsString()
  symbol: string;
}
