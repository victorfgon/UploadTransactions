import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The ID of the transaction.' })
  id?: number;

  @Column()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The type of the transaction.' })
  type: number;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ description: 'The date of the transaction.' })
  date: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The product description of the transaction.' })
  product: string;

  @Column()
  @IsNumber()
  @ApiProperty({ description: 'The value of the transaction in cents.' })
  value: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The seller s name of the transaction.' })
  seller: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'The creation date of the transaction.' })
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The update date of the transaction.' })
  updatedAt?: Date;
}
