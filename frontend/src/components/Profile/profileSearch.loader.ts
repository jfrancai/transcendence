import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function loader(props: { request: Request }) {
  let error = false;
  const { request } = props;
  const jwt = localStorage.getItem('jwt');
  if (!jwt) return window.location.replace('/');

  const path = request.url.substring(request.url.indexOf('/profile'));
  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt}` }
  };

  const index = [...path.matchAll(/\//gi)].map((a) => a.index);
  let username = path.substring(index[1]! + 1);
  if (username.includes('/')) username = username.replace('/', '');

  const result = await axios
    .get(`${CONST_BACKEND_URL}/img/download/${username}`, config)
    .then((res: AxiosResponse) => res.data)
    .catch((err: AxiosError) => {
      if (err) error = true;
    });

  if (error) return window.location.replace('/');

  const fetchUser = await axios
    .post(`${CONST_BACKEND_URL}/user/jwt`, { jwt }, config)
    .then((res: AxiosResponse) => res.data)
    .catch((err: AxiosError) => {
      if (err) error = true;
    });

  const userInfo = {
    ...result,
    userFriendList: fetchUser.friendList
  };
  return error ? window.location.replace('/') : userInfo;
}
