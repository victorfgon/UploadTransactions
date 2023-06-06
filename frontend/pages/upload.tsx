import React, { useContext, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';
import router from 'next/router';

const Upload = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      console.error('No file selected');
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/transactions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('File uploaded:', response.data);
      setIsUploadSuccess(true);
      setUploadErrorMessage('');
    } catch (error) {
      console.error('Error occurred during upload:', error);
      setIsUploadSuccess(false);
      setUploadErrorMessage('An error occurred while importing the file.');
    } finally {
      fileInput.value = '';
      setIsFileSelected(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsFileSelected(!!event.target.files && event.target.files.length > 0);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div style={styles.container}>
      <button onClick={handleGoBack} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Back
      </button>
      <h1 style={styles.heading}>Upload</h1>
      <form onSubmit={handleUpload} style={styles.form}>
      <label htmlFor="file-input" style={{ display: 'none' }}>
        File Input
      </label>
      <input
        id="file-input"
        name="file input"
        type="file"
        onChange={handleFileChange}
        style={styles.input}
      />
        {isFileSelected && (
          <button type="submit" style={styles.button}>Upload</button>
        )}
      </form>
      {isUploadSuccess && (
        <p style={styles.successMessage}>Transactions imported successfully!</p>
      )}
      {uploadErrorMessage && (
        <p style={styles.errorMessage}>{uploadErrorMessage}</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1.2rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '1rem',
    width: '500px',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4285f4',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  successMessage: {
    marginTop: '1rem',
    color: 'green',
    textAlign: 'center' as const,
  },
  errorMessage: {
    marginTop: '1rem',
    color: 'red',
    textAlign: 'center' as const,
  },
};

export default Upload;
