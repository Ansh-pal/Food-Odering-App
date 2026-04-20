import { render, screen } from '@testing-library/react';
import App from './App';

test('renders food ordering portal heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/food ordering portal/i);
  expect(headingElement).toBeInTheDocument();
});
