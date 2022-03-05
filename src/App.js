import { Routes, Route, Link } from 'react-router-dom';
import { Users } from './UsersRouting';
import { NoMatch } from './NoMatch';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Failed fetches (e.g. a "Not Found" fetch) are not cached. Therefore, after a Not Found fetch, 
      // even if stale time is Infinity, react-query will repeatedly call github API if refetch is triggered.
      // This can cause unwanted API calls. (maybe treat "Not Found" as success in the future?)
      staleTime: Infinity,
      retry: false 
    }
  }
});

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
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="users/*" element={<Users />} />
        <Route path="*" element={<NoMatch errLocation="App" />} />
      </Routes>
    </QueryClientProvider>
  );
}

export { App };
