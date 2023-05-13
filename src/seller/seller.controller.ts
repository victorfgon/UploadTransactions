import { Controller, Get, Param } from '@nestjs/common';
import { SellerService } from './seller.service';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get(':id/balance')
  async getBalance(@Param('id') id: number): Promise<number> {
    try {
      const balance = await this.sellerService.getBalance(id);
      return balance;
    } catch (error) {
      throw new Error('Failed to get seller balance.');
    }
  }
}
