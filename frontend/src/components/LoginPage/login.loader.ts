import { redirect } from 'react-router-dom';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function loader() {
  let error = false;
  const jwt = localStorage.getItem('jwt');
  if (!jwt) return redirect('/');

  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  };
  const res = await axios
    .get(`${CONST_BACKEND_URL}/auth/token`, config)
    .then((response: AxiosResponse) => response.data)
    .catch((err: AxiosError) => {
      if (err) error = true;
    });

  return error ? redirect('/') : res;
}
