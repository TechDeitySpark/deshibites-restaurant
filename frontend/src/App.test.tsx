import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DeshiBites app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Deshi Bites/i);
  expect(linkElement).toBeInTheDocument();
});
