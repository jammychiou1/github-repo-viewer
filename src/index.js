import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';
import { App } from './App';

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

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
