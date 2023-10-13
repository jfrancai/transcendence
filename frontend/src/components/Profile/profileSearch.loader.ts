import { redirect } from 'react-router-dom';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function loader(props: { request: Request }) {
  const { request } = props;
  const jwt = localStorage.getItem('jwt');
  if (!jwt) redirect('/');

  const path = request.url.substring(request.url.indexOf('/profile'));
  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt}` }
  };

  const index = [...path.matchAll(/\//gi)].map((a) => a.index);
  let username = path.substring(index[1]! + 1);
  if (username.includes('/')) username = username.replace('/', '');

  const fetchUser = await axios
    .get(`${CONST_BACKEND_URL}/user/${username}`, config)
    .then((res: AxiosResponse) => res.data);

  console.log(fetchUser);
  const result = await axios
    .get(`${CONST_BACKEND_URL}/img/download/${username}`, config)
    .then((res: AxiosResponse) => res.data);

  console.log(result);
  return result;
}
