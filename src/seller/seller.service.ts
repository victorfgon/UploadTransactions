import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerRepository } from './seller.repository';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerRepository)
    private sellerRepository: SellerRepository,
  ) {}

  async getBalance(Id: number): Promise<number> {
    try {
      const seller = await this.sellerRepository.findOne({
        where: { id: Id },
      });

      if (seller) {
        return seller.balance;
      } else {
        return 0;
      }
    } catch (error) {
      throw new Error('Failed to fetch producer balance.');
    }
  }
}
