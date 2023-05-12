import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsInt()
  @IsNotEmpty()
  type: number;

  @Column()
  @IsNotEmpty()
  date: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  product: string;

  @Column()
  @IsNumber()
  value: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  seller: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
