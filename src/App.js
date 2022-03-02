import { Routes, Route } from 'react-router-dom';
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
      home
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
