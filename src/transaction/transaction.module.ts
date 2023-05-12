import { Module } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository])],
  providers: [TransactionService],
})
export class TransactionModule {}
