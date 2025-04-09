import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders credit risk predictor heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Credit Risk Predictor/i);
  expect(headingElement).toBeInTheDocument();
});
