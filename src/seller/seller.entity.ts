import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the seller.' })
  id: number;

  @Column({ nullable: true })
  @IsNumber()
  @ApiProperty({
    description:
      'The ID of the producer affiliated with this seller if the seller is not a producer.',
  })
  affiliatedProducerId?: number;

  @Column()
  @IsNumber()
  @ApiProperty({ description: 'The balance of the seller.' })
  balance: number;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date and time when the seller was created.',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The date and time when the seller was last updated.',
  })
  updatedAt: Date;
}
