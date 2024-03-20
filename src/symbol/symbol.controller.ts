import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { SymbolDto } from './dtos/symbol.dto';
import { SymbolService } from './symbol.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ISymbol } from './symbol.interface';

@Controller('stock')
@ApiTags('stock')
export class SymbolController {
  constructor(private symbolService: SymbolService) {}

  @Get('/:symbol')
  @ApiOperation({ summary: 'display certain symbol' })
  @ApiParam({ name: 'symbol', type: 'string', example: 'AAPL', description: "symbol that exists int the finnhub database" })
  async displaySymbol(@Param() param: SymbolDto) {
    const symbol: ISymbol = await this.symbolService.find(param.symbol);
    if (!symbol) {
      throw new NotFoundException('Symbol not found');
    }
    return symbol;
  }

  @Put('/:symbol')
  @ApiOperation({ summary: 'adding a new symbol to the fetching job' })
  @ApiParam({ name: 'symbol', type: 'string', example: 'AAPL', description: "symbol that exists int the finnhub database" })
  async followSymbol(@Param() param: SymbolDto) {
    try {
      return await this.symbolService.create(param.symbol);
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        throw new HttpException('Symbol with this name already exists.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
