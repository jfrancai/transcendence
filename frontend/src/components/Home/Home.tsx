import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="grid h-screen grid-rows-6 bg-[url('./images/background.png')] bg-cover">
      <div className="row-start-3">
        <h1 className="ml-4 inline-block bg-gradient-to-r from-indigo-600 via-rose-400 to-profile-purple bg-clip-text font-roboto text-[50px] font-bold text-transparent hover:drop-shadow-[0_1.2px_1.1px_rgba(255,255,255,0.8)]">
          PLAY
        </h1>
      </div>
      <div className="row-start-4">
        <Link to="/profile">
          <h1 className="ml-4 inline-block bg-gradient-to-r from-indigo-600 via-rose-400 to-profile-purple bg-clip-text font-roboto text-[50px] font-bold text-transparent hover:drop-shadow-[0_1.2px_1.1px_rgba(255,255,255,0.8)]">
            PROFILE
          </h1>
        </Link>
      </div>
      <div className="row-start-5">
        <h1 className="ml-4 inline-block bg-gradient-to-r from-indigo-600 via-rose-400 to-profile-purple bg-clip-text font-roboto text-[50px] font-bold text-transparent hover:drop-shadow-[0_1.2px_1.1px_rgba(255,255,255,0.8)]">
          LOGOUT
        </h1>
      </div>
    </div>
  );
}
