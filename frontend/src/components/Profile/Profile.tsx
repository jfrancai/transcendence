import { useLoaderData } from 'react-router-dom';
import IMAGES from '@img';

// will add other info when needed
export default function Profile() {
  const data = useLoaderData() as {
    img: string;
    ext: string;
    username: string;
  };
  const base64Image =
    data.ext === '.jpeg' ? 'data:image/jpeg;base64' : 'data:image/png;base64';

  return (
    <div className="bg-blue-pong-3">
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
                src={`${base64Image},${data.img}`}
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
                  {data.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
