import React from 'react';
import { render, screen} from '@testing-library/react';
import HomePage from '../../pages';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from '../../pages/auth-context';

jest.mock('axios');

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('HomePage', () => {
  test('should render login button when not logged in', () => {
    render(
      <AuthContext.Provider value={{ token: null, setToken: jest.fn() }}>
        <HomePage />
      </AuthContext.Provider>
    );
    
    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton).toBeInTheDocument();
  });
});