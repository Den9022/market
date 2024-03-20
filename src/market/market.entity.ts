import { AfterInsert, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  price: number;

  @Column()
  timestamp: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted market log corresponding to: ', this.symbol);
  }
}
