export interface ISymbol {
  id: number;
  name: string;
  currentPrice?: number;
  averagePrice?: number;
  lastUpdated?: Date;
}
