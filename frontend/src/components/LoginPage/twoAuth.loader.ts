import { redirect } from 'react-router-dom';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function loader(): Promise<string> {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) redirect('/');
  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt!}` }
  };
  const result: string = await axios
    .post(`${CONST_BACKEND_URL}/auth/2fa-generate`, {}, config)
    .then((res: AxiosResponse) => res.data);
  return result;
}
