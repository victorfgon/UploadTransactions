import React, { useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from './auth-context';

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email: 'admin3@gmail.com',
        password: '@123Abc',
      });
      const { token } = response.data;
      if (authContext) {
        authContext.setToken(token);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  const handleUploadClick = () => {
    if (!token) {
      console.error('Not logged in');
      return;
    }
    router.push('/upload');
  };

  const handleTransactionsClick = () => {
    router.push('/transaction');
  };

  return (
    <div>
      <h1>Home Page</h1>
      {token ? (
        <>
          <button onClick={handleUploadClick}>Upload Transactions</button>
          <button onClick={handleTransactionsClick}>Go to Transactions</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default HomePage;
