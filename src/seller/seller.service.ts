import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Seller } from './seller.entity';

@Injectable()
export class SellerService {
  constructor(private readonly entityManager: EntityManager) {}

  async getBalance(id: number): Promise<number> {
    try {
      const seller = await this.entityManager.findOne(Seller, {
        where: { id },
      });

      if (seller) {
        return seller.balance;
      } else {
        return 0;
      }
    } catch (error) {
      throw new Error('Failed to fetch seller balance.');
    }
  }
}
