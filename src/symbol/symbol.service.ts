import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Symbol } from './symbol.entity';
import { ISymbol } from './symbol.interface';

@Injectable()
export class SymbolService {
  constructor(@InjectRepository(Symbol) private repo: Repository<ISymbol>) {}

  async create(name: string): Promise<ISymbol> {
    const symbol: ISymbol = this.repo.create({ name });
    return this.repo.save(symbol);
  }

  async findOne(id: number): Promise<ISymbol> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async find(name: string): Promise<ISymbol> {
    if (!name) {
      return null;
    }
    return this.repo.findOneBy({ name });
  }

  async list(): Promise<ISymbol[]> {
    return this.repo.find();
  }

  async updateCurrentPrice(name: string, price: number): Promise<ISymbol> {
    const symbol: ISymbol = await this.find(name);
    if (!symbol) {
      return null;
    }
    symbol.currentPrice = price;
    symbol.lastUpdated = new Date();
    return this.repo.save(symbol);
  }

  async updateAveragePrice(name: string, price: number): Promise<ISymbol> {
    const symbol: ISymbol = await this.find(name);
    if (!symbol) {
      return null;
    }
    symbol.averagePrice = price;
    symbol.lastUpdated = new Date();
    return this.repo.save(symbol);
  }
}
