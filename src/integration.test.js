import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { setupServer } from 'msw/node';
import { defaultFallbackInView } from 'react-intersection-observer';
import userEvent from '@testing-library/user-event';

import { makeMswHandler } from './testHelper';
import { App } from './App';

// mock IntersectionObserver and make it always report that every observed node is InView
defaultFallbackInView(true); 

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('links in RepoList leads to the correct RepoPage', async () => {
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
      <MemoryRouter initialEntries={['/users/alice/repos']}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/^repo1$/i);
  expect(screen.queryByText(/Loading more/i)).not.toBeInTheDocument();

  const link = screen.getByText(/^repo1$/i);
  userEvent.click(link);
  
  await screen.findByText(/^description$/i);
});
