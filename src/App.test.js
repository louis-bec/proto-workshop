/* eslint-disable import/first */
import { render, screen } from '@testing-library/react';
jest.mock('@fluentui/react-components');
import App from './App';

test('renders login heading', async () => {
  window.history.pushState({}, '', '/login');
  render(<App />);
  const heading = await screen.findByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});
