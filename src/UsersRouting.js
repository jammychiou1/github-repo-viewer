import { Routes, Route, useParams } from 'react-router-dom';
import { Repos } from './ReposRouting';
import { NoMatch } from './NoMatch';

function Users() {
  return (
    <Routes>
      <Route path=":username/*" element={<UsernameParser />} />
      <Route path="*" element={<NoMatch errLocation="Users" />} />
    </Routes>
  );
}

const usernameRegex = /^[a-zA-Z0-9_-]{1,39}$/;
function UsernameParser() {
  const params = useParams();
  const username = params.username;
  if (usernameRegex.test(username)) {
    return (
      <Routes>
        <Route path="repos/*" element={<Repos username={username} />} />
        <Route path="*" element={<NoMatch errLocation="UsernameParser" />} />
      </Routes>
    );
  }
  else {
    return (
      <div>
        Invalid username ({username})
      </div>
    );
  }
}

export { Users };
