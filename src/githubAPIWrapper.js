async function fetchRepoList({queryKey, pageParam = 1}) {
  const username = queryKey[1];
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=10&page=${pageParam}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw Error(error.message ?? 'Unknown error');
  }
  const data = await response.json();
  const cleanedData = data.map(({name, stargazers_count}) => ({name, stargazers_count}));
  return {repos: cleanedData};
}

async function fetchRepoDescription({queryKey}) {
  const username = queryKey[1];
  const repo = queryKey[2];
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);

  if (!response.ok) {
    const error = await response.json();
    throw Error(error.message ?? 'Unknown error');
  }
  const data = await response.json();
  const cleanData = ({full_name, description, stargazers_count, html_url}) => ({full_name, description, stargazers_count, html_url});
  return cleanData(data);
}

export { fetchRepoList, fetchRepoDescription };
