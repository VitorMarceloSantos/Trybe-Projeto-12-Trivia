async function fetchToken() {
  const url = 'https://opentdb.com/api_token.php?command=request';
  const request = await fetch(url);
  const response = await request.json();

  return response;
}

export default fetchToken;
