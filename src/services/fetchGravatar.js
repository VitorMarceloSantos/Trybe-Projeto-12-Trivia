import md5 from 'crypto-js/md5';

function fetchGravatar(email) {
  const hashEmail = md5(email).toString();
  const url = `https://www.gravatar.com/avatar/${hashEmail}`;

  return url;
}

export default fetchGravatar;
