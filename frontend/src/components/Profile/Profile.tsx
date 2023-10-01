import IMAGES from '@img';

export default function Profile() {
  return (
    <div className="bg-blue-pong-3">
      <div className="flex h-screen flex-none flex-col items-center justify-start">
        <div className="relative flex h-1/2 grow-0 flex-col items-end rounded-[20px]">
          <div className="absolute flex h-[100%] w-[100%] flex-col rounded-[20px] bg-red-600 opacity-[0.7]">
            <img
              className="object-fill object-center"
              src={IMAGES.background_profile}
              alt="profile background"
            />
          </div>
          <div className="z-10 flex flex-none overflow-visible rounded-[20px] bg-blue-950 bg-opacity-90 p-7 shadow-lg">
            <p className="grid grid-cols-10 gap-1 text-center text-slate-200">
              <p className="grid grid-cols-1 text-center">
                <p className="text-sm font-bold text-gray-500">Total Game</p>
                <p className="text-white-800">1242</p>
              </p>
              <p className="text-4xl font-[10] text-gray-500">|</p>
              <p className="grid grid-cols-1 text-center">
                <p className="text-sm font-bold text-gray-500">Win Rate</p>
                <p className="text-white-800">65%</p>
              </p>
              <p className="text-4xl font-[10] text-gray-500">|</p>
              <p className="grid grid-cols-1 text-center">
                <p className="text-sm font-bold text-gray-500">Lose Rate</p>
                <p className="text-white-800">35%</p>
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
<p className="Location col-start-10 grid grid-cols-1 text-center">
<p className="text-sm font-bold text-gray-500">Location</p>
<p className="text-white-800">France</p>
</p>
*/
