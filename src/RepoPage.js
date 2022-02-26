function RepoPage(props) {
  const username = props.username;
  const repo = props.repo;
  return (
    <div>
      real repo {repo} of user {username}
    </div>
  );
}

export { RepoPage };
