import { Module } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository])],
})
export class TransactionModule {}
