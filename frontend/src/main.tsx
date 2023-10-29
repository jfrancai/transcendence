import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { action as loginTwoAuthAction } from '@login/loginTwoAuth.action';
import { action as createAction } from '@login/create.action';
import { action as loginAction } from '@login/login.action';
import { loader as loginTwoAuthLoader } from '@login/logintwoAuth.loader';
import { loader as uploadImageLoader } from '@login/uploadImage.loader';
import HomePage from '@login/HomePage';
import LoginForm from '@login/LoginForm';
import CreateForm from '@login/CreateForm';
import LoginTwoAuthForm from '@login/LoginTwoAuthForm';
import ErrorPage from '@login/ErrorPage';
import ErrorValidation from '@login/ErrorValidation';
import ValidationTwoAuth from '@login/ValidationTwoAuth';
import UploadImg from '@login/UploadImg';
import { loader as profileLoader } from './components/Profile/profile.loader';
import { action as profileAction } from './components/Profile/profile.action';
import { loader as profileSearchLoader } from './components/Profile/profileSearch.loader';
import { loader as homeLoader } from './components/Home/home.loader';
import Pong from './components/Pong/Pong';
import Profile from './components/Profile/Profile';
import ProfileSearch from './components/Profile/ProfileSearch';
import Home from './components/Home/Home';
import './index.css';
import Chat from './features/Chat/Chat';
import InvitePong from './components/InvitePong/InvitePong';
import { PongInviteStateContextProvider } from './contexts/pongInviteState';

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
    loader: loginTwoAuthLoader
  },
  {
    path: '/login',
    element: <LoginForm />,
    errorElement: <LoginForm />,
    action: loginAction
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
    errorElement: <UploadImg />,
    loader: uploadImageLoader
  },
  {
    path: '/pong/:username',
    element: <InvitePong />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Chat />
      }
    ]
  },
  {
    path: '/pong',
    element: <Pong />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <PongInviteStateContextProvider><Chat /></PongInviteStateContextProvider>
      }
    ]
  },
  {
    path: '/profile',
    element: <Profile />,
    children: [
      {
        path: '',
        element: <Chat />
      }
    ],
    errorElement: <Profile />,
    loader: profileLoader,
    action: profileAction
  },
  {
    path: '/profile/:username',
    element: <ProfileSearch />,
    children: [
      {
        path: '',
        element: <Chat />
      }
    ],
    errorElement: <ErrorPage />,
    loader: profileSearchLoader
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '',
        element: <Chat />
      }
    ],
    loader: homeLoader
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
