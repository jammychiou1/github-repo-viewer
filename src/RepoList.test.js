import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { defaultFallbackInView } from 'react-intersection-observer';

import { RepoList } from './RepoList.js';

// mock IntersectionObserver and make it always report that every observed node is InView
defaultFallbackInView(true); 

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// mute react-queuy logging to get cleaner testing output (for the "not found" test)
setLogger({
  log: () => {},
  warn: () => {},
  error: () => {},
});

function mockAndRender(testingUsername, mockedDatabase) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // avoid timeout in the "not found" test
        retry: false 
      }
    }
  });

  server.use(
    rest.get('https://api.github.com/users/:username/repos', (req, res, ctx) => {
      const page = req.url.searchParams.get('page') ?? 1;
      const per_page = req.url.searchParams.get('per_page') ?? 30;
      const { username } = req.params;
      if (!(username in mockedDatabase)) {
        return res(ctx.status(404), ctx.json({message: 'Not Found'}));
      }
      return res(ctx.json(mockedDatabase[username].slice((page - 1) * per_page, page * per_page)));
    }),
  );
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RepoList username={testingUsername} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('render 2 repos', async () => {
  mockAndRender('alice', {
    alice: [
      {name: 'repo1', stargazers_count: 100},
      {name: 'repo2', stargazers_count: 200}
    ]
  });
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByRole('table');

  const repo1 = screen.getByText(/^repo1$/i);
  const row1 = repo1.closest('tr');
  const stargazers1 = screen.getByText('100');
  expect(repo1).toBeInTheDocument();
  expect(row1).toBeInTheDocument();
  expect(stargazers1).toBeInTheDocument();
  expect(row1).toContainElement(stargazers1);

  const repo2 = screen.getByText(/^repo2$/i);
  const row2 = repo2.closest('tr');
  const stargazers2 = screen.getByText('200');
  expect(repo2).toBeInTheDocument();
  expect(row2).toBeInTheDocument();
  expect(stargazers2).toBeInTheDocument();
  expect(row2).toContainElement(stargazers2);
});

test('display empty when there are 0 repos', async () => {
  mockAndRender('alice', {alice: []});
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/empty/i);
});

test('display loading message when loading next page (20 repos)', async () => {
  const repos = [];
  for (let i = 1; i <= 20; i++) {
    repos.push({name: `repo${i}`, stargazers_count: i * 100});
  }
  mockAndRender('alice', {alice: repos});
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/^repo1$/i);
  expect(screen.getByText(/^repo1$/i)).toBeInTheDocument();
  expect(screen.queryByText(/^repo11$/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Loading more/i)).toBeInTheDocument();

  await screen.findByText(/^repo11$/i);
  expect(screen.getByText(/Loading more/i)).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading more/i));
});

test('display loading message when loading next page (15 repos)', async () => {
  const repos = [];
  for (let i = 1; i <= 15; i++) {
    repos.push({name: `repo${i}`, stargazers_count: i * 100});
  }
  mockAndRender('alice', {alice: repos});
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/^repo1$/i);
  expect(screen.queryByText(/^repo11$/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Loading more/i)).toBeInTheDocument();

  await screen.findByText(/^repo11$/i);
  expect(screen.queryByText(/Loading more/i)).not.toBeInTheDocument();
});

test('not found', async () => {
  mockAndRender('alice', {bob: []});
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/Not Found/i);
});

// test link
