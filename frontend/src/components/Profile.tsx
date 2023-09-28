interface UserProfile {
  name: string;
  email: string;
}

// eslint-next-line-disable
interface ProfileProps {
  user: UserProfile;
}

export default function Profile() {
  return (
    <div className="flex h-screen flex-none flex-col items-center justify-center">
      <div className="flex h-1/2 flex-none grow-0 items-end rounded-[20px] bg-[url('./images/background_profile.png')] bg-cover bg-center">
        <div className="flex flex-none overflow-visible rounded-[20px] bg-blue-950 bg-opacity-90 p-7 shadow-lg">
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
            <p className="Location col-start-10 grid grid-cols-1 text-center">
              <p className="text-sm font-bold text-gray-500">Location</p>
              <p className="text-white-800">France</p>
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}
