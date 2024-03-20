import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SymbolModule } from './symbol/symbol.module';
import { Symbol } from './symbol/symbol.entity';
import { MarketModule } from './market/market.module';
import { Market } from './market/market.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: configService.get<string>('DB_NAME'),
          synchronize: configService.get<boolean>('SYNCHRONIZE'),
          entities: [Symbol, Market],
        };
      },
    }),
    SymbolModule,
    MarketModule,
  ],
})
export class AppModule {}
