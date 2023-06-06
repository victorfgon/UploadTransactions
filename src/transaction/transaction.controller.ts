import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Logger,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('api/v1/transactions')
@ApiTags('Transactions')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private transactionService: TransactionService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'File sent with success!' })
  @ApiResponse({ status: 500, description: 'Failed to import transactions' })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    try {
      await this.transactionService.importTransactions(file.buffer);
      return { message: 'File sent with success!' };
    } catch (error) {
      this.logger.error(`Failed to import transactions: ${error.message}`);
      throw new Error('Failed to import transactions. Please try again later.');
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: Transaction,
    isArray: true,
    description: 'Returns all transactions',
  })
  async getAllTransactions(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions(page, limit);
  }
}
