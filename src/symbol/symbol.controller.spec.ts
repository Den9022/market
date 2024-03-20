import { Test, TestingModule } from '@nestjs/testing';
import { SymbolController } from './symbol.controller';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SymbolService } from './symbol.service';
import { ISymbol } from './symbol.interface';

describe('SymbolController', () => {
  let controller: SymbolController;
  let fakeSymbolService: Partial<SymbolService>;

  beforeEach(async () => {
    fakeSymbolService = {
      find: (name: string) => {
        if (!name) {
          throw new NotFoundException();
        }
        return Promise.resolve({
          name,
          currentPrice: 123,
          lastUpdated: new Date(),
        } as ISymbol);
      },
      create: (name: string) => {
        if ((name == 'duplicate')) {
          throw new HttpException('Symbol with this name already exists.', HttpStatus.BAD_REQUEST);
        }
        return Promise.resolve({
          name,
          currentPrice: 123,
          lastUpdated: new Date(),
        } as ISymbol);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymbolController],
      providers: [
        {
          provide: SymbolService,
          useValue: fakeSymbolService,
        },
      ],
    }).compile();

    controller = module.get<SymbolController>(SymbolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('displaySymbol returns a symbol with the given name, currentprice and lastUpdated date', async () => {
    const symbol: ISymbol = await controller.displaySymbol({ symbol: 'AAPL' });
    expect(symbol.name).toEqual('AAPL');
    expect(symbol.currentPrice).toBeDefined();
    expect(symbol.lastUpdated).toBeDefined();
  });

  it('displaySymbol throws an error if symbol with given name is not found', async () => {
    await expect(controller.displaySymbol({ symbol: '' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('followSymbol should add a symbol to the symbol table', async () => {
    const symbol: ISymbol = await controller.followSymbol({ symbol: 'AAPL' });
    expect(symbol.name).toEqual('AAPL');
    expect(symbol.currentPrice).toBeDefined();
    expect(symbol.lastUpdated).toBeDefined();
  });

  it('displaySymbol throws an error if symbol is already exists', async () => {
    await expect(controller.followSymbol({ symbol: 'duplicate' })).rejects.toThrow(
      new HttpException('Symbol with this name already exists.', HttpStatus.BAD_REQUEST),
    );
  });
});
