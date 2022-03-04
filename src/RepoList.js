import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { InView } from 'react-intersection-observer';

import { fetchRepoList } from './GithubAPIWrapper';

function RepoList(props) {
  const username = props.username;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['repoList', username], fetchRepoList, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.repos.length !== 10) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

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

  const renderList = () => {
    const pages = data.pages;
    if (pages.reduce((partial, page) => partial + page.repos.length, 0) === 0 && !isFetchingNextPage) {
      return (
        <div>
          <i>(Empty)</i>
        </div>
      );
    }

    return (
      <InView 
        triggerOnce 
        onChange={inView => {
          if (hasNextPage && inView) {
            fetchNextPage();
          }
        }}
      >
        {({ ref }) => (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Stargazers Count</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, i) => (
                  <Fragment key={i}>
                    {page.repos.map(
                      (repo, j) => (
                        <tr key={repo.name} ref={(i === pages.length - 1 && j === page.repos.length - 1) ? ref : null}>
                          <td>
                            <Link to={`/users/${username}/repos/${repo.name}`}>
                              {repo.name}
                            </Link>
                          </td>
                          <td>
                            {repo.stargazers_count}
                          </td>
                        </tr>
                      )
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {isFetchingNextPage && 'Loading more...'}
          </div>
        )}
      </InView>
    );
  }

  return (
    <div>
      <h1>
        Repository list of {username}
      </h1>
      {renderList()}
    </div>
  );
}

export { RepoList };
