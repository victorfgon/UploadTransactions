import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions } from 'typeorm';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async importTransactions(file: Buffer): Promise<void> {
    try {
      const transactions: Transaction[] = [];
      const lines = file.toString('utf-8').split('\n');

      for (const line of lines) {
        const type = line.substr(0, 1);
        const date = line.substr(1, 25).trim();
        const product = line.substr(26, 30).trim();
        const value = parseFloat(line.substr(56, 10));
        const seller = line.substr(66, 20).trim();

        const transaction: Transaction = {
          type: parseInt(type),
          date: new Date(date),
          product,
          value,
          seller,
        };

        if (!Number.isNaN(transaction.value)) {
          transactions.push(transaction);
          await this.entityManager.save(Transaction, transaction);
        }
      }

      this.logger.log(
        `Imported ${transactions.length} transactions successfully.`,
      );
    } catch (error) {
      this.logger.error('Failed to import transactions.', error);
      throw new Error('Failed to import transactions. Please try again later.');
    }
  }

  async getAllTransactions(
    page: number,
    limit: number,
  ): Promise<Transaction[]> {
    try {
      const options: FindManyOptions<Transaction> = {
        skip: (page - 1) * limit,
        take: limit,
      };
      return this.entityManager.find(Transaction, options);
    } catch (error) {
      this.logger.error('Failed to fetch transactions.', error);
      throw new Error('Failed to fetch transactions.');
    }
  }
}
