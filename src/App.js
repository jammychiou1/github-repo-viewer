import { Routes, Route, Link } from 'react-router-dom';
import { Users } from './UsersRouting';
import { NoMatch } from './NoMatch';

function Home() {
  return (
    <div>
      <h1>Github Repository Viewer</h1>

      <h2>List all repositories of a user</h2>
      <div>{'Format: /users/{username}/repos'}</div>
      <div>Example: <Link to="/users/jammychiou1/repos">/users/jammychiou1/repos</Link></div>

      <h2>Inspect a specific repository</h2>
      <div>{'Format: /users/{username}/repos/{repo}'}</div>
      <div>Example: <Link to="/users/jammychiou1/repos/github-repo-viewer">/users/jammychiou1/repos/github-repo-viewer</Link></div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="users/*" element={<Users />} />
      <Route path="*" element={<NoMatch errLocation="App" />} />
    </Routes>
  );
}

export { App };
