import { redirect } from 'react-router-dom';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function loader() {
  let error = false;
  const jwt = localStorage.getItem('jwt');
  if (!jwt) return redirect('/');

  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt!}` }
  };
  const result = await axios
    .post(`${CONST_BACKEND_URL}/auth/2fa-generate`, {}, config)
    .then((res: AxiosResponse) => res.data)
    .catch((err: AxiosError) => {
      if (err) error = true;
    });
  return error ? redirect('/') : result;
}
