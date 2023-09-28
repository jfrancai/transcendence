import { redirect } from 'react-router-dom';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function action(props: { request: Request }) {
  const { request } = props;
  const formData = await request.formData();
  const tmp = Object.fromEntries(formData);
  const user = {
    username: tmp.username.toString(),
    password: tmp.password.toString()
  };

  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  };
  const result = await axios
    .post(`${CONST_BACKEND_URL}/auth/login`, user, config)
    .then((response: AxiosResponse) => response.data);

  localStorage.setItem('jwt', result.access_token);
  return redirect('/home');
}
