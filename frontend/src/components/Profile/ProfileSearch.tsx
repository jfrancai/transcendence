import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, Outlet } from 'react-router-dom';
import IMAGES from '@img';
import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig } from 'axios';

export default function ProfileSearch() {
  const [isFriend, setIsFriend] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const data = useLoaderData() as {
    img: string;
    username: string;
    tofind_uuid: string;
    userFriendList: string[];
  };

  useEffect(() => {
    if (data.userFriendList) {
      const findFriend = data.userFriendList.find(
        (value) => value === data.tofind_uuid
      );
      setIsFriend(findFriend);
    }
  }, [data.tofind_uuid, data.userFriendList]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let newFriendList: string[] = [];
    const jwt = localStorage.getItem('jwt');
    if (!jwt) navigate('/');

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    if (isFriend) {
      newFriendList = data.userFriendList.filter(
        (value) => value !== data.tofind_uuid
      );
      setIsFriend(undefined);
    } else {
      if (data.userFriendList) {
        newFriendList = [
          ...data.userFriendList.filter((value) => value !== data.tofind_uuid),
          data.tofind_uuid
        ];
      } else {
        newFriendList = [data.tofind_uuid];
      }
      setIsFriend(data.tofind_uuid);
    }

    await axios.put(
      `${CONST_BACKEND_URL}/user/update`,
      { friendList: newFriendList },
      config
    );
  };

  return (
    <>
      <div className="bg-[url('../images/background.png')] bg-cover">
        <div className="flex h-screen flex-none flex-col items-center justify-start">
          <div className="relative flex grow-0 flex-col items-center rounded-[20px]">
            <div className="relative flex h-1/2 w-1/2 flex-col rounded-[20px]">
              <img
                className="object-fill object-center"
                src={IMAGES.background_profile}
                alt="profile background"
              />
            </div>
            <div className="absolute bottom-[45%] z-[2]">
              <img
                className={
                  isFriend
                    ? 'h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-[4px] border-green-login md:h-24 md:w-20 lg:h-32 lg:w-32'
                    : 'h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-[4px] border-profile-purple md:h-24 md:w-20 lg:h-32 lg:w-32'
                }
                src={data.img}
                alt="pp"
              />
            </div>
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
                    {data.username}
                  </p>
                  <div className="grid grid-cols-1">
                    <button
                      className="col-start-10 mt-1 grid text-right"
                      type="button"
                      onClick={handleClick}
                    >
                      <img
                        width="32"
                        height="32"
                        title={isFriend ? 'Remove Friend' : 'Add Friend'}
                        className=""
                        src={
                          isFriend ? IMAGES.remove_friends : IMAGES.add_friends
                        }
                        alt="friend icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
