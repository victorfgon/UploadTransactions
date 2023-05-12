import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TransactionModule } from './transaction/transaction.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TransactionModule,
    SellerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
