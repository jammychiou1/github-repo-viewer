import { Routes, Route } from 'react-router-dom';
import { Users } from './UsersRouting';
import { NoMatch } from './NoMatch';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
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
