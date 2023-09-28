import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { action as loginTwoAuthAction } from './components/LoginPage/loginTwoAuth.action';
import { action as createAction } from './components/LoginPage/create.action';
import { action as loginAction } from './components/LoginPage/login.action';
import { loader as twoAuthLoader } from './components/LoginPage/twoAuth.loader';
import { loader as loginLoader } from './components/LoginPage/login.loader';
import HomePage from './components/LoginPage/HomePage';
import LoginForm from './components/LoginPage/LoginForm';
import CreateForm from './components/LoginPage/CreateForm';
import LoginTwoAuthForm from './components/LoginPage/LoginTwoAuthForm';
import ErrorPage from './components/LoginPage/ErrorPage';
import ErrorValidation from './components/LoginPage/ErrorValidation';
import ValidationTwoAuth from './components/LoginPage/ValidationTwoAuth';
import UploadImg from './components/LoginPage/UploadImg';
import Pong from './components/Pong/Pong';
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
    action: loginAction,
    loader: loginLoader
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
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
