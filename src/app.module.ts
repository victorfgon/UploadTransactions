import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TransactionModule } from './transaction/transaction.module';
import { SellerModule } from './seller/seller.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TransactionModule,
    MulterModule.register({
      dest: './',
    }),
    SellerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
