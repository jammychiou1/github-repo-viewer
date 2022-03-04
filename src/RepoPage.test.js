import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { setupServer } from 'msw/node';

import { makeMswHandler } from './testHelper';
import { RepoPage } from './RepoPage';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('RepoPage renders with correct infomation', async () => {
  const mockedDatabase = {
    alice: [
      {
        name: 'repo1',
        full_name: 'alice/repo1',
        description: 'The first repo of Alice',
        stargazers_count: 100,
        html_url: 'https://github.com/alice/repo1'
      }
    ]
  };

  const queryClient = new QueryClient();

  server.use(...makeMswHandler(mockedDatabase));

  render(
    <QueryClientProvider client={queryClient}>
      <RepoPage username="alice" repo="repo1" />
    </QueryClientProvider>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/description/i);
  expect(screen.getByText(/The first repo of Alice/i)).toBeInTheDocument();

  const link = screen.getByText(/^alice\/repo1$/i).closest('a');
  expect(link).toHaveAttribute('href', 'https://github.com/alice/repo1');
});
