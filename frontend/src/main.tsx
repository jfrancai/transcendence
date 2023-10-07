import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { action as loginTwoAuthAction } from '@login/loginTwoAuth.action';
import { action as createAction } from '@login/create.action';
import { action as loginAction } from '@login/login.action';
import { loader as twoAuthLoader } from '@login/twoAuth.loader';
import HomePage from '@login/HomePage';
import LoginForm from '@login/LoginForm';
import CreateForm from '@login/CreateForm';
import LoginTwoAuthForm from '@login/LoginTwoAuthForm';
import ErrorPage from '@login/ErrorPage';
import ErrorValidation from '@login/ErrorValidation';
import ValidationTwoAuth from '@login/ValidationTwoAuth';
import UploadImg from '@login/UploadImg';
import { loader as loaderProfile } from './components/Profile/profile.loader';
import Pong from './components/Pong/Pong';
import Profile from './components/Profile/Profile';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <CreateForm />,
    errorElement: <CreateForm />,
    action: createAction
  },
  {
    path: '/2fa-validation',
    element: <ValidationTwoAuth />,
    errorElement: <ErrorValidation />,
    loader: twoAuthLoader
  },
  {
    path: '/login',
    element: <LoginForm />,
    errorElement: <LoginForm />,
    action: loginAction
  },
  {
    path: '/2fa-validation',
    element: <ValidationTwoAuth />,
    loader: twoAuthLoader
  },
  {
    path: '/2fa-login',
    element: <LoginTwoAuthForm />,
    errorElement: <LoginTwoAuthForm />,
    action: loginTwoAuthAction
  },
  {
    path: '/upload_img',
    element: <UploadImg />,
    errorElement: <UploadImg />
  },
  {
    path: '/pong',
    element: <Pong />
  },
  {
    path: '/profile',
    element: <Profile />,
    loader: loaderProfile
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
