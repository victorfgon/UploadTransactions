import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Upload from '../../pages/upload';
import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
describe('Upload Page', () => {
  beforeEach(() => {
    render(<Upload />);
  });

  test('should render the Upload page correctly', () => {
    const uploadText = screen.getByText(/Upload/i);
    const backButton = screen.getByRole('button', { name: /Back/i });
    const fileInput = screen.getByLabelText('File Input');

    expect(uploadText).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
  });

  test('should display success message on successful upload', async () => {
    const mock = new MockAdapter(axios);
  
    const file = new File(
      [
        '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS\n' +
          '12021-12-03T11:46:02-03:00DOMINANDO INVESTIMENTOS       0000050000MARIA CANDIDA',
      ],
      'test-file.txt',
      { type: 'text/plain' }
    );
  
    const formData = new FormData();
    formData.append('file', file);
  
    mock.onPost('http://localhost:3000/api/v1/transactions').reply(200, {
      message: 'Transactions imported successfully!',
    });
  
    const fileInput = screen.getByLabelText('File Input');
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    fireEvent.submit(screen.getByRole('button', { name: 'Upload' }));
  
    await waitFor(() => {
      expect(screen.getByText('Transactions imported successfully!')).toBeInTheDocument();
    });
  
    mock.restore();
  });
  

  test('should display error message on upload failure', async () => {
    const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);
  
    const fetchMock = jest.fn().mockRejectedValueOnce(new Error('Upload failed'));
  
    const originalFetch = global.fetch;

    global.fetch = fetchMock;
  
    const fileInput = screen.getByLabelText('File Input');
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    fireEvent.submit(screen.getByRole('button', { name: 'Upload' }));
  
    await waitFor(() => {
      expect(screen.getByText(/An error occurred while importing the file./i)).toBeInTheDocument();
    });
  
    global.fetch = originalFetch;
  });
  
});
