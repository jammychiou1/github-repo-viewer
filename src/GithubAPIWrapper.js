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

function fetchRepoDescription(username, repo) {
}

export { fetchRepoList, fetchRepoDescription };
