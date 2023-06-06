import {
  Controller,
  Get,
  Param,
  UseGuards,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Seller } from './seller.entity';

@Controller('api/v1/sellers')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Sellers')
@ApiBearerAuth()
export class SellerController {
  private readonly logger = new Logger(SellerController.name);

  constructor(private readonly sellerService: SellerService) {}

  @Get(':id/balance')
  @ApiParam({ name: 'id', type: 'number', description: 'Seller ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the balance of the seller',
    type: Seller,
  })
  async getBalance(@Param('id') id: number): Promise<number> {
    try {
      const balance = await this.sellerService.getBalance(id);
      return balance;
    } catch (error) {
      this.logger.error(`Failed to get seller balance: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to get seller balance');
      }
    }
  }
}
