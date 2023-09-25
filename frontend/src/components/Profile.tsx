interface UserProfile {
  name: string;
  email: string;
}

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="flex h-screen flex-none flex-col items-center justify-center">
      <div className="flex h-1/2 flex-none grow-0 items-end rounded-[20px] bg-[url('./images/background_profile.png')] bg-cover bg-center">
        <div class="flex flex-none rounded-[20px] bg-blue-950 bg-opacity-90 p-7 shadow-lg overflow-visible">
          <p class="grid grid-cols-10 gap-1 text-center text-slate-200">
            <p class="grid grid-cols-1 text-center">
              <p class="text-gray-500 font-bold text-sm">Total Game</p>
              <p class="text-white-800">1242</p>
            </p>
            <p class="text-4xl font-[10] text-gray-500">|</p>
            <p class="grid grid-cols-1 text-center">
              <p class="text-gray-500 font-bold text-sm">Win Rate</p>
              <p class="text-white-800">65%</p>
            </p>
            <p class="text-4xl font-[10] text-gray-500">|</p>
            <p class="grid grid-cols-1 text-center">
              <p class="text-gray-500 font-bold text-sm">Lose Rate</p>
              <p class="text-white-800">35%</p>
            </p>
            <p class="Location col-start-10 grid grid-cols-1 text-center">
              <p class="text-gray-500 font-bold text-sm">Location</p>
              <p class="text-white-800">France</p>
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
