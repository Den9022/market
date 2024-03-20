import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { SymbolModule } from 'src/symbol/symbol.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './market.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Market]), SymbolModule],
  providers: [MarketService],
})
export class MarketModule {}
