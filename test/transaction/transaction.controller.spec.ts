import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from 'src/transaction/transaction.controller';
import { TransactionService } from 'src/transaction/transaction.service';
import { Transaction } from 'src/transaction/transaction.entity';
import { EntityManager } from 'typeorm';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  describe('uploadFile', () => {
    it('should upload file and return success message', async () => {
      const bufferMock = Buffer.from('File content');

      jest.spyOn(service, 'importTransactions').mockImplementation(async () => {
        // mock
      });

      const result = await controller.uploadFile({ buffer: bufferMock } as any);

      expect(service.importTransactions).toHaveBeenCalledWith(bufferMock);
      expect(result).toEqual({ message: 'File sent with success!' });
    });

    it('should handle errors during file upload', async () => {
      const bufferMock = Buffer.from('File content');
      const errorMessage = 'Failed to import transactions';

      jest.spyOn(service, 'importTransactions').mockImplementation(async () => {
        throw new Error(errorMessage);
      });

      await expect(
        controller.uploadFile({ buffer: bufferMock } as any),
      ).rejects.toThrowError(errorMessage);
    });
  });

  describe('getAllTransactions', () => {
    it('should return all transactions', async () => {
      const transactionsMock: Transaction[] = [{}, {}] as Transaction[];

      jest.spyOn(service, 'getAllTransactions').mockImplementation(async () => {
        return transactionsMock;
      });

      const result = await controller.getAllTransactions();

      expect(service.getAllTransactions).toHaveBeenCalled();
      expect(result).toEqual(transactionsMock);
    });
  });
});
