function NoMatch(props) {
  const errLocation = props.errLocation;
  return (
    <div>
      Unknown URL under {errLocation}
    </div>
  );
}

export { NoMatch };
