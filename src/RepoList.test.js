import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RepoList } from './RepoList.js';
import { fetchRepoList } from './GithubAPIWrapper';

jest.mock('./GithubAPIWrapper', () => ({
  fetchRepoList: jest.fn()
}));

beforeEach(() => {
  fetchRepoList.mockReset();
});

function mockAndRender(testingUsername, mockedResult, mockedError) {
  fetchRepoList.mockImplementation(username => {
    expect(username).toBe(testingUsername);
    return {
      result: mockedResult,
      error: mockedError,
    };
  });
  render(
    <MemoryRouter>
      <RepoList username={testingUsername} />
    </MemoryRouter>
  );
}

test('several repos', async () => {
  mockAndRender('alice', [
    {name: 'repo1', stargazers_count: 100},
    {name: 'repo2', stargazers_count: 200}
  ], null);
  expect(screen.getByText(/Repository list/i)).toBeInTheDocument();
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByRole('table');

  const repo1 = screen.getByText(/repo1/i);
  const row1 = repo1.closest('tr');
  const stargazers1 = screen.getByText('100');
  expect(repo1).toBeInTheDocument();
  expect(row1).toBeInTheDocument();
  expect(stargazers1).toBeInTheDocument();
  expect(row1).toContainElement(stargazers1);

  const repo2 = screen.getByText(/repo2/i);
  const row2 = repo2.closest('tr');
  const stargazers2 = screen.getByText('200');
  expect(repo2).toBeInTheDocument();
  expect(row2).toBeInTheDocument();
  expect(stargazers2).toBeInTheDocument();
  expect(row2).toContainElement(stargazers2);
});

test('zero repos', async () => {
  mockAndRender('alice', [], null);
  expect(screen.getByText(/Repository list/i)).toBeInTheDocument();
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/empty/i);
});

test('error returned in fetchRepoList', async () => {
  mockAndRender('alice', null, 'Testing error');
  expect(screen.getByText(/Repository list/i)).toBeInTheDocument();
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await screen.findByText(/Testing error/i);
});

// test link
