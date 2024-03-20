import { AfterInsert, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Symbol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  currentPrice: number;

  @Column({ nullable: true })
  averagePrice: number;

  @Column({ nullable: true })
  lastUpdated: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Symbol with name', this.name);
  }
}
