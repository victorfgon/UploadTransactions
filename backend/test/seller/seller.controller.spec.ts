import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from 'src/seller/seller.controller';
import { SellerService } from 'src/seller/seller.service';
import { EntityManager } from 'typeorm';

describe('SellerController', () => {
  let controller: SellerController;
  let sellerService: SellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerController],
      providers: [
        SellerService,
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SellerController>(SellerController);
    sellerService = module.get<SellerService>(SellerService);
  });

  describe('getBalance', () => {
    it('should return the balance of the seller', async () => {
      const sellerId = 1;
      const balance = 1000;
      jest.spyOn(sellerService, 'getBalance').mockResolvedValueOnce(balance);

      const result = await controller.getBalance(sellerId);

      expect(sellerService.getBalance).toHaveBeenCalledTimes(1);
      expect(sellerService.getBalance).toHaveBeenCalledWith(sellerId);
      expect(result).toBe(balance);
    });

    it('should throw an error if failed to get seller balance', async () => {
      const sellerId = 1;
      const errorMessage = 'Failed to get seller balance';
      jest
        .spyOn(sellerService, 'getBalance')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(controller.getBalance(sellerId)).rejects.toThrowError(
        errorMessage,
      );
    });
  });
});
