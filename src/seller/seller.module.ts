import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerRepository } from './seller.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SellerRepository])],
  providers: [],
})
export class SellerModule {}
