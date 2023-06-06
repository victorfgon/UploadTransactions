import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Seller } from './seller.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);

  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async getBalance(id: number): Promise<number> {
    try {
      const seller = await this.entityManager.findOne(Seller, {
        where: { id },
      });

      if (seller) {
        return seller.balance;
      } else {
        throw new NotFoundException('Seller not found');
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch seller balance. Error: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('Failed to fetch seller balance');
      }
    }
  }
}
