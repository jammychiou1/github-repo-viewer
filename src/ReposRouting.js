import { Routes, Route, useParams } from 'react-router-dom';
import { RepoList } from './RepoList';
import { RepoPage } from './RepoPage';
import { NoMatch } from './NoMatch';

function Repos(props) {
  const username = props.username;
  return (
    <Routes>
      <Route path="" element={<RepoList username={username} />} />
      <Route path=":repo" element={<RepoParser username={username} />} />
      <Route path="*" element={<NoMatch errLocation="Repos" />} />
    </Routes>
  );
}

const repoRegex = /^[A-Za-z0-9_.-]+$/;
function RepoParser(props) {
  const username = props.username;
  const params = useParams();
  const repo = params.repo;
  if (repoRegex.test(repo)) {
    return (
      <RepoPage username={username} repo={repo} />
    );
  }
  else {
    return (
      <div>
        Invalid repository name ({repo})
      </div>
    );
  }
}

export { Repos };
