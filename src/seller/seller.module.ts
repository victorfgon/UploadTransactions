import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
