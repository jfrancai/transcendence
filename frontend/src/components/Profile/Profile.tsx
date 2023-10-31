import { useState, useEffect } from 'react';
import { isRouteErrorResponse, useRouteError, Outlet } from 'react-router-dom';
import IMAGES from '@img';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';
import ModifyProfile from './ModifyProfile';
import { isError } from '../../utils/functions/isError';
import MatchHistory from './MatchHistory';
import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

type DataUser = { img: string; username: string; uuid: string };

// will add other info when needed
export default function Profile() {
  const error = useRouteError();
  const [data, setData] = useState<DataUser | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [option, setOption] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const jwt = localStorage.getItem('jwt');
  const decodedToken: DecodedToken = jwt_decode(jwt!);

  const { username } = useParams();


  useEffect(() => {
    const url = `${CONST_BACKEND_URL}/user/status/${
      !username ? decodedToken.username : username
    }`;

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };

    axios
      .get(url, config)
      .then((data: any) => {
        console.log(data.data);
      })
      .catch(() => {});

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

  useEffect(() => {
    if (error && isRouteErrorResponse(error)) {
      setErrorMsg(error.data.message);
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    } else if (error && isError(error)) {
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }
  }, [error]);

  useEffect(() => {
    if (!data) {
      const jwt = localStorage.getItem('jwt');

      const fetchData = async () => {
        const config: AxiosRequestConfig = {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwt}` }
        };
        const dataUser: DataUser = await axios
          .get(`${CONST_BACKEND_URL}/img/download`, config)
          .then((res: AxiosResponse) => res.data);

        setData(dataUser);
      };

      fetchData();
    }
  }, [data]);

  const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOption(true);
  };

  const handleClickClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOption(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const allowedTypes = ['image/jpeg', 'image/png'];
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20000) {
        setErrorMsg('Invalid size of image should be under 20KB.');
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        e.target.value = '';
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg('Invalid file type.');
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        e.target.value = '';
        return;
      }

      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="bg-default bg-cover">
        <div className="flex h-screen flex-none flex-col items-center justify-start">
          <div className="relative flex grow-0 flex-col items-center rounded-[20px]">
            <div className="relative flex h-1/2 w-1/2 flex-col rounded-[20px]">
              <img
                className="object-fill object-center"
                src={IMAGES.background_profile}
                alt="profile background"
              />
            </div>
            {data && (
              <div className="absolute bottom-[45%] z-[2]">
                <img
                  className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-[4px] border-profile-purple md:h-24 md:w-20 lg:h-32 lg:w-32"
                  src={imagePreview === null ? data.img : imagePreview}
                  alt="pp"
                />
              </div>
            )}
            <div className="absolute left-[20%] right-[20%] top-[60%] z-[1] flex flex-none overflow-visible rounded-[20px] bg-blue-950 bg-opacity-90 p-7 shadow-lg md:sticky md:top-32 lg:sticky lg:top-40">
              <div className="grid grid-cols-10 gap-1 text-center text-slate-200">
                <div className="grid grid-cols-1 text-center">
                  <p className="text-sm font-bold text-gray-500">Total Game</p>
                  <p className="text-white-800">1242</p>
                </div>
                <p className="text-4xl font-[10] text-gray-500">|</p>
                <div className="grid text-center">
                  <p className="text-sm font-bold text-gray-500">Win Rate</p>
                  <p className="text-white-800">65%</p>
                </div>
                <p className="text-4xl font-[10] text-gray-500">|</p>
                <div className="grid text-center">
                  <p className="text-sm font-bold text-gray-500">Lose Rate</p>
                  <p className="text-white-800">35%</p>
                </div>
                <div className="col-start-10 grid text-right">
                  <p className="text-white-800 text-sm font-bold">
                    {data ? data.username : ''}
                  </p>
                  <div className="grid grid-cols-1">
                    <button
                      className="col-start-10 mt-1 grid text-right"
                      type="button"
                      onClick={handleClickOption}
                    >
                      <img
                        width="18"
                        height="18"
                        title="Modify Your Profile"
                        src={IMAGES.option_wheel}
                        alt="option"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MatchHistory />
          <ModifyProfile
            error={errorMsg}
            option={option}
            username={data ? data.username : ''}
            setOption={setOption}
            handleClickClose={handleClickClose}
            handleUpload={handleUpload}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
