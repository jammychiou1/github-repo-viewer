import { Routes, Route } from 'react-router-dom';
import { Users } from './UsersRouting';
import { NoMatch } from './NoMatch';

function Home() {
  return (
    <div>
      home
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
