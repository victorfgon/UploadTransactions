import { Seller } from 'src/seller/seller.entity';
import { SellerService } from 'src/seller/seller.service';
import { EntityManager } from 'typeorm';

describe('SellerService', () => {
  let sellerService: SellerService;
  let entityManager: EntityManager;

  beforeEach(() => {
    entityManager = {} as EntityManager;
    sellerService = new SellerService(entityManager);
  });

  describe('getBalance', () => {
    it('should return seller balance if seller exists', async () => {
      const sellerId = 1;
      const sellerBalance = 1000;
      const sellerMock: Seller = {
        id: sellerId,
        balance: sellerBalance,
      } as Seller;

      entityManager.findOne = jest.fn().mockResolvedValueOnce(sellerMock);

      const result = await sellerService.getBalance(sellerId);

      expect(entityManager.findOne).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledWith(Seller, {
        where: { id: sellerId },
      });
      expect(result).toBe(sellerBalance);
    });

    it('should return 0 if seller does not exist', async () => {
      const sellerId = 1;

      entityManager.findOne = jest.fn().mockResolvedValueOnce(null);

      const result = await sellerService.getBalance(sellerId);

      expect(entityManager.findOne).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledWith(Seller, {
        where: { id: sellerId },
      });
      expect(result).toBe(0);
    });

    it('should throw an error if failed to fetch seller balance', async () => {
      const sellerId = 1;
      const errorMessage = 'Failed to fetch seller balance.';

      entityManager.findOne = jest
        .fn()
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(sellerService.getBalance(sellerId)).rejects.toThrowError(
        errorMessage,
      );

      expect(entityManager.findOne).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledWith(Seller, {
        where: { id: sellerId },
      });
    });
  });
});
