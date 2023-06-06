import React, { useState, useContext, ChangeEvent } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';
import { useRouter } from 'next/router';

const SellerBalance = () => {
  const [sellerId, setSellerId] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [foundId, setFoundId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSellerId(event.target.value);
    setError(false);
  };

  const clearData = () => {
    setBalance(null);
    setFoundId(null);
    setError(false);
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/sellers/${sellerId}/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data);
      setFoundId(sellerId);
      setError(false);
    } catch (error) {
      console.error('Error fetching seller balance:', error);
      setError(true);
    }
  };

  const handleGetBalance = async () => {
    if (sellerId.trim() !== '') {
      clearData();
      fetchBalance();
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f2f2f2' }}>
      <button onClick={handleGoBack} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Back
      </button>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Seller Balance</h1>
      <label htmlFor="sellerId" style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>Enter Seller ID:</label>
      <input
        id="sellerId"
        type="text"
        value={sellerId}
        onChange={handleInputChange}
        style={{ padding: '0.5rem', fontSize: '1.2rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1rem', width: '300px' }}
      />
      <button onClick={handleGetBalance} style={{ padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', backgroundColor: '#4285f4', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Get Balance</button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>ID not found</p>}
      {balance !== null && !error && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p>ID: {foundId}</p>
          <p>Balance: {balance}</p>
        </div>
      )}
    </div>
  );
};

export default SellerBalance;
