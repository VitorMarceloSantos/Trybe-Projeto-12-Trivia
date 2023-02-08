const getLocalStorage = () => localStorage.getItem('token');

async function fetchApi() {
  const token = getLocalStorage();
  const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
  const request = await fetch(url);
  const response = await request.json();

  return response;
}

export default fetchApi;
