import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
