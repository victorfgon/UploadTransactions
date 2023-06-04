import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';

interface Transaction {
  id: number;
  type: number;
  date: string;
  product: string;
  value: number;
  seller: string;
}

const Transactions = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      <h1>Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Product</th>
            <th>Value</th>
            <th>Seller</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.type}</td>
              <td>{transaction.date}</td>
              <td>{transaction.product}</td>
              <td>{transaction.value}</td>
              <td>{transaction.seller}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
