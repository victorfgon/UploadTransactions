import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}

  async importTransactions(transactions: Transaction[]): Promise<void> {
    try {
      for (const transaction of transactions) {
        const normalizedTransaction =
          this.normalizeTransactionData(transaction);

        const newTransaction = this.transactionRepository.create(
          normalizedTransaction,
        );

        await this.transactionRepository.save(newTransaction);
      }

      this.logger.log(
        `Imported ${transactions.length} transactions successfully.`,
      );
    } catch (error) {
      this.logger.error('Failed to import transactions.', error);
      throw new Error('Failed to import transactions. Please try again later.');
    }
  }

  normalizeTransactionData(transaction: Transaction): Transaction {
    const [date, product, value, seller] = transaction.date
      .toString()
      .split(' ');

    const normalizedTransaction: Transaction = {
      ...transaction,
      date: new Date(date),
      product: product.trim(),
      value: parseFloat(value),
      seller: seller.trim(),
    };

    return normalizedTransaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await this.transactionRepository.find();
      return transactions;
    } catch (error) {
      throw new Error('Failed to fetch transactions.');
    }
  }
}
