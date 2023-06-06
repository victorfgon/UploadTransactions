import { Transaction } from 'src/transaction/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { EntityManager } from 'typeorm';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let entityManager: EntityManager;

  beforeEach(() => {
    entityManager = {} as EntityManager;
    transactionService = new TransactionService(entityManager);
  });

  describe('importTransactions', () => {
    it('should import transactions successfully', async () => {
      entityManager.save = jest.fn().mockResolvedValueOnce(null);

      const fileMock = Buffer.from(
        '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS',
      );

      await transactionService.importTransactions(fileMock);

      expect(entityManager.save).toHaveBeenCalledTimes(1);
      expect(entityManager.save).toHaveBeenCalledWith(Transaction, {
        type: 1,
        date: new Date('2022-01-15T19:20:30-03:00'),
        product: 'CURSO DE BEM-ESTAR',
        value: 12750,
        seller: 'JOSE CARLOS',
      });
    });

    it('should not import invalid transactions', async () => {
      entityManager.save = jest.fn().mockResolvedValueOnce(null);

      const fileMock = Buffer.from('Invalid Data');

      await transactionService.importTransactions(fileMock);

      expect(entityManager.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('getAllTransactions', () => {
    it('should fetch transactions', async () => {
      const transactionsMock: Transaction[] = [{}, {}] as Transaction[];

      entityManager.find = jest.fn().mockResolvedValueOnce(transactionsMock);

      const result = await transactionService.getAllTransactions(1, 20);

      expect(entityManager.find).toHaveBeenCalledTimes(1);
      expect(entityManager.find).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ skip: 0, take: 20 }),
      );
      expect(result).toEqual(transactionsMock);
    });
  });
});
