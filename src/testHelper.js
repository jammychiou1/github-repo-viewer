import { rest } from 'msw';

function makeMswHandler(mockedDatabase) {
  return [
    rest.get('https://api.github.com/users/:username/repos', (req, res, ctx) => {
      const page = req.url.searchParams.get('page') ?? 1; const per_page = req.url.searchParams.get('per_page') ?? 30;
      const { username } = req.params;
      if (!(username in mockedDatabase)) {
        return res(ctx.status(404), ctx.json({message: 'Not Found'}));
      }
      return res(ctx.json(mockedDatabase[username].slice((page - 1) * per_page, page * per_page)));
    }),
    rest.get('https://api.github.com/repos/:username/:repo', (req, res, ctx) => {
      const { username, repo } = req.params;
      if (!(username in mockedDatabase)) {
        return res(ctx.status(404), ctx.json({message: 'Not Found'}));
      }
      for (let i = 0; i < mockedDatabase[username].length; i++) {
        if (mockedDatabase[username][i].name === repo) {
          return res(ctx.json(mockedDatabase[username][i]));
        }
      }
      return res(ctx.status(404), ctx.json({message: 'Not Found'}));
    })
  ]
}

function makeSampleRepoList(count) {
  // [
  //  {name: 'repo1', stargazers_count: 100},
  //  {name: 'repo2', stargazers_count: 200},
  //  ...
  // ]
  const repos = [];
  for (let i = 1; i <= count; i++) {
    repos.push({name: `repo${i}`, stargazers_count: i * 100});
  }
  return repos;
}

export { makeMswHandler, makeSampleRepoList };
