// TODO: paging, caching
async function fetchRepoList(username) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  
  if (!response.ok) {
    const error = await response.json();
    return {
      name: null, 
      error: error.message ?? 'Unknown error'
    };
  }
  const data = await response.json();
  const cleanedData = data.map(({name, stargazers_count}) => ({name, stargazers_count}));
  return {result: cleanedData, error: null};
}

function fetchRepoDescription(username, repo) {
}

export { fetchRepoList, fetchRepoDescription };
