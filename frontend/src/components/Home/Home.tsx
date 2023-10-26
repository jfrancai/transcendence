import { useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { CONST_BACKEND_URL } from '@constant';

export default function Home() {
  const navigate = useNavigate();
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const jwt = localStorage.getItem('jwt');
    if (!jwt) navigate('/');

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    await axios.get(`${CONST_BACKEND_URL}/auth/logout`, config);
    localStorage.removeItem('jwt');
    navigate('/');
  };

  const handleProfile = () => {
    document.body.className = 'preload';
    setTimeout(() => {
      document.body.className = '';
    }, 500);
  };

  useEffect(() => {
    const handleNavigation = () => {
      document.body.className = 'preload';
      setTimeout(() => {
        document.body.className = '';
      }, 500);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  return (
    <>
      <div className="grid h-screen grid-rows-6 bg-[url('./images/background.png')] bg-cover">
        <div className="row-start-3">
          <Link to="/pong" title="Launch a Game of Pong">
            <h1 className="ml-4 inline-block bg-gradient-to-r from-indigo-600 via-rose-400 to-profile-purple bg-clip-text font-roboto text-[50px] font-bold text-transparent hover:drop-shadow-[0_1.2px_1.1px_rgba(255,255,255,0.8)]">
              PLAY
            </h1>
          </Link>
        </div>
        <div className="row-start-4">
          <Link
            to="/profile"
            onClick={handleProfile}
            title="Go to your profile"
          >
            <h1 className="ml-4 inline-block bg-gradient-to-r from-indigo-600 via-rose-400 to-profile-purple bg-clip-text font-roboto text-[50px] font-bold text-transparent hover:drop-shadow-[0_1.2px_1.1px_rgba(255,255,255,0.8)]">
              PROFILE
            </h1>
          </Link>
        </div>
        <div className="row-start-5">
          <Link
            to="/"
            onClick={handleLogout}
            title="Disconnect from the application"
          >
            <h1 className="ml-4 inline-block bg-gradient-to-r from-indigo-600 via-rose-400 to-profile-purple bg-clip-text font-roboto text-[50px] font-bold text-transparent hover:drop-shadow-[0_1.2px_1.1px_rgba(255,255,255,0.8)]">
              LOGOUT
            </h1>
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}
