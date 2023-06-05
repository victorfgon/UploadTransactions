import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';

const SellerBalance = () => {
  const [sellerId, setSellerId] = useState('');
  const [balance, setBalance] = useState(null);
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSellerId(event.target.value);
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/sellers/${sellerId}/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching seller balance:', error);
    }
  };

  const handleGetBalance = async () => {
    if (sellerId.trim() !== '') {
      fetchBalance();
    }
  };

  return (
    <div>
      <h1>Seller Balance</h1>
      <label htmlFor="sellerId">Enter Seller ID:</label>
      <input
        id="sellerId"
        type="text"
        value={sellerId}
        onChange={handleInputChange}
      />
      <button onClick={handleGetBalance}>Get Balance</button>
      {balance !== null && (
        <div>
          <p>ID: {sellerId}</p>
          <p>Balance: {balance}</p>
        </div>
      )}
    </div>
  );
};

export default SellerBalance;
