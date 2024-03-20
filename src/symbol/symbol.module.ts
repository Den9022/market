import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymbolController } from './symbol.controller';
import { Symbol } from './symbol.entity';
import { SymbolService } from './symbol.service';

@Module({
  imports: [TypeOrmModule.forFeature([Symbol])],
  controllers: [SymbolController],
  providers: [SymbolService],
  exports: [SymbolService],
})
export class SymbolModule {}
