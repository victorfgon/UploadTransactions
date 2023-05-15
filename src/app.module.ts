import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TransactionModule } from './transaction/transaction.module';
import { SellerModule } from './seller/seller.module';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TransactionModule,
    MulterModule.register({
      dest: './',
    }),
    SellerModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
