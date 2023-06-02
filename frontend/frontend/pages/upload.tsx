import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email: 'admin3@gmail.com',
        password: '@123Abc',
      });
      const { token } = response.data;
      setToken(token);
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  const handleUpload = async () => {
    if (!token) {
      console.error('Not logged in');
      return;
    }

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      console.error('No file selected');
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/transactions', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error occurred during upload:', error);
    }
  };

  return (
    <div>
      <h1>Upload</h1>
      {token ? (
        <>
          <input id="file-input" type="file" />
          <button onClick={handleUpload}>Upload</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default Upload;
