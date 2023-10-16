import { redirect } from 'react-router-dom';
import axios from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function loader() {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) redirect('/');
  const result = await axios.get(`${CONST_BACKEND_URL}/img/download`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt!}` }
  });

  return result.data;
}
