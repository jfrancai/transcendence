import { CONST_BACKEND_URL } from '@constant';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Props {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  select?: boolean;
  chanID: string;
}

const style = Object.freeze({
  xs: 'h-[39px] w-[39px] border-[1.2px]',
  s: 'h-[50px] w-[50px] border-[1.7px]',
  m: 'h-[78px] w-[78px] border-[2.5px]',
  l: 'h-[110px] w-[110px] border-[3.5px]',
  xl: 'h-[155px] w-[155px] border-[5px]'
});

export function ChanPicture({ size = 'xl', select = false, chanID }: Props) {
  const [data, setData] = useState<{
    img: string;
    ext: string;
  }>({ img: '', ext: '' });

  useEffect(() => {
    const fetchData = async (id: string) => {
      if (!chanID) return;
      const jwt = localStorage.getItem('jwt');
      try {
        const response = await axios.get(
          `${CONST_BACKEND_URL}/img/download/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${jwt!}` }
          }
        );
        setData(response.data);
      } catch (e: any) {
        if (e.message) {
          console.log(e.message);
        } else {
          console.log(e);
        }
      }
    };
    fetchData(chanID);
  }, [chanID]);

  return (
    <img
      alt="channel"
      src={`${
        data.ext === '.jpeg'
          ? 'data:image/jpeg;base64'
          : 'data:image/png;base64'
      },${data.img}`}
      className={`object-contain ${
        style[size]
      } w-flex-shrink-0 relative flex items-end justify-center rounded-full ${
        select ? 'border-solid border-pong-purple-100' : 'border-none'
      } bg-cover bg-no-repeat`}
    />
  );
}
