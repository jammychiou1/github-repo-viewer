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
    console.log('called with', props)
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
  const home = screen.getByText(/home/i);
  expect(home).toBeInTheDocument();
});

test('route to repo list correctly', () => {
  renderWithHistory(['/users/alice/repos']);
  const home = screen.getByText(/repo list of user alice/i);
  expect(home).toBeInTheDocument();
});

test('route to repo page correctly', () => {
  renderWithHistory(['/users/alice/repos/test-repo']);
  const home = screen.getByText(/repo page test-repo of user alice/i);
  expect(home).toBeInTheDocument();
});

function checkUnknownURLMessage() {
  const message = screen.getByText(/Unknown URL/i);
  expect(message).toBeInTheDocument();
}

test('unknown url under app', () => {
  renderWithHistory(['/bad']);
  checkUnknownURLMessage();
});

test('unknown url under users', () => {
  renderWithHistory(['/users']);
  checkUnknownURLMessage();
});

test('unknown url under username parser', () => {
  renderWithHistory(['/users/alice/unknown']);
  checkUnknownURLMessage();
});

test('unknown url under repos', () => {
  renderWithHistory(['/users/alice/repos/extra/depth']);
  checkUnknownURLMessage();
});

test('invalid username (too long)', () => {
  renderWithHistory(['/users/usernametoooooooooooooooooolooooooooooooooooong']);
  const home = screen.getByText(/Invalid username/i);
  expect(home).toBeInTheDocument();
});

test('invalid username (forbidden character)', () => {
  renderWithHistory(['/users/plussign+']);
  const home = screen.getByText(/Invalid username/i);
  expect(home).toBeInTheDocument();
});

test('invalid repo name (forbidden character)', () => {
  renderWithHistory(['/users/alice/repos/plussign+']);
  const home = screen.getByText(/Invalid repository name/i);
  expect(home).toBeInTheDocument();
});
