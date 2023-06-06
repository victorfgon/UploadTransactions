import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../../pages/auth-context';
import SellerBalance from '../../pages/seller-balance';

jest.mock('axios');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SellerBalance', () => {
  const token = 'dummyToken';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SellerBalance component', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(
      <AuthContext.Provider value={{ token, setToken: () => {} }}>
        <SellerBalance />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Seller Balance')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter Seller ID:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Balance' })).toBeInTheDocument();
  });

  test('clicking "Back" button should navigate to home page', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(
      <AuthContext.Provider value={{ token, setToken: () => {} }}>
        <SellerBalance />
      </AuthContext.Provider>
    );

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/');
  });

  test('fetches seller balance and displays it when "Get Balance" button is clicked', async () => {
    const sellerId = '123';
    const balance = 500;
    const response = { data: balance };
    (axios.get as jest.Mock).mockResolvedValue(response);

    render(
      <AuthContext.Provider value={{ token, setToken: () => {} }}>
        <SellerBalance />
      </AuthContext.Provider>
    );

    const input = screen.getByLabelText('Enter Seller ID:');
    fireEvent.change(input, { target: { value: sellerId } });

    const getBalanceButton = screen.getByRole('button', { name: 'Get Balance' });
    fireEvent.click(getBalanceButton);

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/api/v1/sellers/${sellerId}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(`ID: ${sellerId}`)).toBeInTheDocument();
      expect(screen.getByText(`Balance: ${balance}`)).toBeInTheDocument();
    });
  });

  test('displays "ID not found" error message when seller ID is not found', async () => {
    const sellerId = '456';
    const errorMessage = 'ID not found';
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <AuthContext.Provider value={{ token, setToken: () => {} }}>
        <SellerBalance />
      </AuthContext.Provider>
    );

    const input = screen.getByLabelText('Enter Seller ID:');
    fireEvent.change(input, { target: { value: sellerId } });

    const getBalanceButton = screen.getByRole('button', { name: 'Get Balance' });
    fireEvent.click(getBalanceButton);

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/api/v1/sellers/${sellerId}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
