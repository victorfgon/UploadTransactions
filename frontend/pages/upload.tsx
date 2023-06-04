import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';

const Upload = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleUpload = async (event: React.FormEvent) => {
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
    } catch (error) {
      console.error('Error occurred during upload:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFileSelected(!!event.target.files && event.target.files.length > 0);
  };

  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleUpload}>
        <input id="file-input" type="file" onChange={handleFileChange} />
        {isFileSelected && <button type="submit">Upload</button>}
      </form>
    </div>
  );
};

export default Upload;
