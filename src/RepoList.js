import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRepoList } from './GithubAPIWrapper';

function renderList(username, error, result) {
  if (error !== '') {
    return (
      <div>
        Error: {error}
      </div>
    );
  }
  if (result === null) {
    return (
      <div>
        Loading...
      </div>
    );
  }
  if (result.length === 0) {
    return (
      <div>
        <i>(Empty)</i>
      </div>
    );
  }

  const renderItem = (repo) => (
    <tr key={repo.name}>
      <td>
        <Link to={`/users/${username}/repos/${repo.name}`}>
          {repo.name}
        </Link>
      </td>
      <td>
        {repo.stargazers_count}
      </td>
    </tr>
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Stargazers Count</th>
          </tr>
        </thead>
        <tbody>
          {result.map(renderItem)}
        </tbody>
      </table>
    </div>
  );
}

function RepoList(props) {
  const username = props.username;
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const fetchAndUpdate = async () => {
      const {result: newResult, error: newError} = await fetchRepoList(username);
      if (!cancelled) {
        if (newError !== null) {
          setError(newError);
          return;
        }
        setResult(newResult);
      }
    }

    fetchAndUpdate();
    return () => {
      cancelled = true
    };
  }, [username]);
  return (
    <div>
      <h1>
        Repository list of {username}
      </h1>
      {renderList(username, error, result)}
    </div>
  );
}

export { RepoList };
