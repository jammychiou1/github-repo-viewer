import { useQuery } from 'react-query';

import { fetchRepoDescription } from './GithubAPIWrapper';
function RepoPage(props) {
  const username = props.username;
  const repo = props.repo;

  const {
    data,
    error,
    status,
  } = useQuery(['repoList', username, repo], fetchRepoDescription);

  if (status === 'loading') {
    return (
      <div>
        Loading...
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div>
        Error: {error.message}
      </div>
    );
  }
  const {full_name, description, stargazers_count, html_url} = data;
  return (
    <div>
      <h1>
        <a href={html_url}>{full_name}</a>
      </h1>
      {`Stargazers Count: ${stargazers_count}`}
      <h2>Description</h2>
      {description}
    </div>
  );
}

export { RepoPage };
