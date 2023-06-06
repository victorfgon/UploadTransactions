import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TransactionModule } from './transaction/transaction.module';
import { SellerModule } from './seller/seller.module';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TransactionModule,
    MulterModule.register({
      dest: './',
    }),
    SellerModule,
    UsersModule,
    AuthModule,
    SwaggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
