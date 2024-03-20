/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SymbolService } from 'src/symbol/symbol.service';
import { Repository } from 'typeorm';
import { Market } from './market.entity';
import { ConfigService } from '@nestjs/config';
import { ISymbol } from 'src/symbol/symbol.interface';
import { IMarket } from './market.interface';
const finnhub = require('finnhub');
const cron = require('node-cron');

@Injectable()
export class MarketService {
  private client;
  private api_key;

  constructor(
    @InjectRepository(Market) private repo: Repository<Market>,
    private symbolService: SymbolService,
    private configService: ConfigService
  ) {
    this.api_key = finnhub.ApiClient.instance.authentications['api_key'];
    this.api_key.apiKey = this.configService.get<string>('API_KEY'),
    this.client = new finnhub.DefaultApi();
    this.startCronJob();
  }

  async startCronJob(): Promise<void> {
    cron.schedule('* * * * *', async () => {
      console.log('Fetching data!');
      const symbols: ISymbol[] = await this.symbolService.list();

      symbols.forEach((symbol: ISymbol) => {
        console.log(`Fetching: ${symbol.name}`);

        this.client.quote(symbol.name, async (error, data) => {
          if (error) {
            console.error(
              `The following error happened while API communication: ${error}`,
            );
          } else {
            console.log(`The current price of ${symbol.name} is: ${data.c}`);
            await this.updateMarketData(symbol.name, data.c);
            await this.symbolService.updateCurrentPrice(symbol.name, data.c);
          }
        });
        this.calculateAveragePrice(symbol.name);
      });
    });
  }

  async updateMarketData(symbol: string, price: number): Promise<void> {
    const timestamp: Date = new Date();
    const market: IMarket = this.repo.create({ symbol, price, timestamp });
    await this.repo.save(market);
  }

  async calculateAveragePrice(symbol: string): Promise<void> {
    const marketDataBySymbol: IMarket[] = await this.repo.find({
      where: { symbol },
      take: 10,
    });
    if(marketDataBySymbol.length < 9) {
      return
    }
    const totalPrice: number = marketDataBySymbol.reduce(
      (previousValue: number, currentValue: IMarket) => {
        return previousValue + currentValue.price;
      },
      0,
    );
    await this.symbolService.updateAveragePrice(symbol, totalPrice / 10);
  }
}
