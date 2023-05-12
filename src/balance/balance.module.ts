import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceRepository } from './balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceRepository])],
})
export class BalanceModule {}
