import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<any> {
    try {
      await this.transactionService.importTransactions(file);

      return { message: 'File sent with success!' };
    } catch (error) {
      throw new Error('Failed to import transactions. Please try again later.');
    }
  }

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }
}
