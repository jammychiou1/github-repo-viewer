import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

function renderWithHistory(entries = ['/']) {
  render(
    <MemoryRouter initialEntries={entries}>
      <App />
    </MemoryRouter>
  );
}

jest.mock('./RepoList', () => {
  const FakeRepoList = props => {
    const username = props.username;
    return (
      <div>
        repo list of user {username}
      </div>
    );
  }
  return {RepoList: FakeRepoList};
})

jest.mock('./RepoPage', () => {
  const FakeRepoPage = props => {
    const username = props.username;
    const repo = props.repo;
    return (
      <div>
        repo page {repo} of user {username}
      </div>
    );
  }
  return {RepoPage: FakeRepoPage};
})

test('route to homepage correctly', () => {
  renderWithHistory();
  expect(screen.getByText(/Github Repository Viewer/i)).toBeInTheDocument();
});

test('route to repo list correctly', () => {
  renderWithHistory(['/users/alice/repos']);
  expect(screen.getByText(/repo list of user alice/i)).toBeInTheDocument();
});

test('route to repo page correctly', () => {
  renderWithHistory(['/users/alice/repos/test-repo']);
  expect(screen.getByText(/repo page test-repo of user alice/i)).toBeInTheDocument();
});

test('unknown url under app', () => {
  renderWithHistory(['/bad']);
  expect(screen.getByText(/Unknown URL/i)).toBeInTheDocument();
});

test('unknown url under users', () => {
  renderWithHistory(['/users']);
  expect(screen.getByText(/Unknown URL/i)).toBeInTheDocument();
});

test('unknown url under username parser', () => {
  renderWithHistory(['/users/alice/unknown']);
  expect(screen.getByText(/Unknown URL/i)).toBeInTheDocument();
});

test('unknown url under repos', () => {
  renderWithHistory(['/users/alice/repos/extra/depth']);
  expect(screen.getByText(/Unknown URL/i)).toBeInTheDocument();
});

test('invalid username (too long)', () => {
  renderWithHistory(['/users/usernametoooooooooooooooooolooooooooooooooooong']);
  expect(screen.getByText(/Invalid username/i)).toBeInTheDocument();
});

test('invalid username (forbidden character)', () => {
  renderWithHistory(['/users/plussign+']);
  expect(screen.getByText(/Invalid username/i)).toBeInTheDocument();
});

test('invalid repo name (forbidden character)', () => {
  renderWithHistory(['/users/alice/repos/plussign+']);
  expect(screen.getByText(/Invalid repository name/i)).toBeInTheDocument();
});
