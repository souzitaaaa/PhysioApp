import axios from 'axios';

export function safeGet(promise, fallback = null) {
  return promise
    .then(res => res.data)
    .catch(() => fallback);
}

export async function getAuxTable(auxTable) {
  return await safeGet(axios.get(`http://localhost:3000/aux/${auxTable}`), []);
}
