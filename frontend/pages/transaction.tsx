import React, { useContext, useState, ChangeEvent, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/transactions?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data);
      setIsLastPage(response.data.length < limit);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [page, limit, token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f2f2f2' }}>
      <button onClick={handleGoBack} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Back
      </button>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Transactions</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <span style={{ margin: '0 0.5rem' }}>Page {page}</span>
        <button onClick={handleNextPage} disabled={isLastPage}>Next</button>
      </div>
      <table style={{ borderCollapse: 'collapse', width: '80%', maxWidth: '800px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Type</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Date</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Product</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Value</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}>Seller</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{transaction.id}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{transaction.type}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{transaction.date}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{transaction.product}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{transaction.value}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>{transaction.seller}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
