import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../../pages/auth-context';
import axios from 'axios';
import React from 'react';
import Transactions from '../../pages/transaction';

jest.mock('axios');

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Transactions', () => {
  test('renders transactions table', async () => {
    const transactionsData = [
      { id: 1, type: 1, date: '2023-05-18', product: 'Product 1', value: 10, seller: 'Seller 1' },
      { id: 2, type: 2, date: '2023-05-19', product: 'Product 2', value: 20, seller: 'Seller 2' },
    ];

    const getMock = jest.spyOn(axios, 'get');
    getMock.mockResolvedValue({ data: transactionsData });

    render(
      <AuthContext.Provider value={{ token: 'dummyToken', setToken: () => {} }}>
        <Transactions />
      </AuthContext.Provider>
    );

    await screen.findAllByRole('row');

    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(transactionsData.length + 1);

    const tableHeaders = screen.getAllByRole('columnheader');
    const tableData = screen.getAllByRole('cell');

    expect(tableHeaders).toHaveLength(6); 
    expect(tableData).toHaveLength(transactionsData.length * 6); 

    getMock.mockRestore();
  });

  test('renders "Back" button and navigates to home page when clicked', () => {
    const pushMock = jest.fn();

    const useRouterMock = jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
      push: pushMock,
    });

    render(
      <AuthContext.Provider value={{ token: 'dummyToken', setToken: () => {} }}>
        <Transactions />
      </AuthContext.Provider>
    );

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/');
    useRouterMock.mockRestore();
  });
});
