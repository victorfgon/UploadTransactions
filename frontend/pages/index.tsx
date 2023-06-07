import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from './auth-context';

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email: 'admin3@gmail.com',
        password: '@123Abc',
      });
      const { token } = response.data;
      if (authContext) {
        authContext.setToken(token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/v1/users',
        {
          name: 'Admin3',
          email: 'admin3@gmail.com',
          password: '@123Abc',
          passwordConfirmation: '@123Abc',
        },
      );
      console.log('User created successfully');
    } catch (error) {
      console.error('Error occurred during user creation:', error);
    }
  };

  const handleUploadClick = () => {
    router.push('/upload');
  };

  const handleTransactionsClick = () => {
    router.push('/transaction');
  };

  const handleSellerBalanceClick = () => {
    router.push('/seller-balance');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>
      {isLoggedIn ? (
        <div style={styles.buttonsContainer}>
          <button onClick={handleUploadClick} style={styles.button}>Upload Transactions</button>
          <button onClick={handleTransactionsClick} style={styles.button}>Go to Transactions</button>
          <button onClick={handleSellerBalanceClick} style={styles.button}>Go to Seller Balance</button>
        </div>
      ) : (
        <>
          <button onClick={handleLogin} style={styles.loginButton}>Login</button>
          <button onClick={handleCreateUser} style={styles.loginButton}>Create User</button>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    padding: '1rem 2rem',
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4285f4',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loginButton: {
    padding: '1rem 2rem',
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f2f2f2',
    border: '2px solid #333',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HomePage;
