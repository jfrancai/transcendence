import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { redirect } from 'react-router-dom';
import { CONST_BACKEND_URL } from '@constant';

export async function action(props: { request: Request }) {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) redirect('/');

  const { request } = props;
  const imageForm = new FormData();
  const formData = await request.formData();
  const file: File = formData.get('pp') as File;
  const tmp = Object.fromEntries(formData);

  imageForm.append('image', file);
  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt!}` }
  };

  if (file && file.size !== 0) {
    await axios.postForm(`${CONST_BACKEND_URL}/img/upload`, imageForm, config);
  }

  if (tmp.username.toString().length !== 0) {
    const checkUsername = await axios
      .post(
        `${CONST_BACKEND_URL}/user/check`,
        { username: tmp.username },
        config
      )
      .then((res: AxiosResponse) => res.data);

    if (!checkUsername) {
      // handle error
    }

    const updateObject = {
      username: tmp.username.toString()
    };

    await axios.put(`${CONST_BACKEND_URL}/user/update`, updateObject, config);
  }

  if (tmp.password.toString().length !== 0) {
    if (tmp.password.toString() !== tmp.confirm.toString()) {
      // handle error
    }
    const updateObject = {
      password: tmp.password.toString()
    };
    await axios.put(`${CONST_BACKEND_URL}/user/update`, updateObject, config);
  }

  if (tmp.password.length === 0 && tmp.username.length === 0) {
    return redirect('/profile');
  }
  return redirect('/');
}
