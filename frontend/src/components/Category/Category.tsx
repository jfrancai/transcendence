import { MdOutlineGroups, MdOutlineLeaderboard } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';
import { BsQuestionCircle } from 'react-icons/bs';

interface CategoryProps {
  type: 'chat' | 'home' | 'leader' | 'support';
}

const iconStyle = 'w-8 h-8 text-pong-blue-100';

const categories = {
  chat: {
    about: 'CHAT ROOM',
    icon: <MdOutlineGroups className={iconStyle} />
  },
  home: {
    about: 'Home Page',
    icon: <AiOutlineHome className={iconStyle} />
  },
  leader: {
    about: 'Leader Boards',
    icon: <BsQuestionCircle className={iconStyle} />
  },
  support: {
    about: 'Support',
    icon: <MdOutlineLeaderboard className={iconStyle} />
  }
};

function Category({ type = 'chat' }: CategoryProps) {
  const { about, icon } = categories[type];
  return (
    <div className="inline-flex items-end justify-center gap-6">
      {icon}
      <p className="text-center text-base font-bold text-white">{about}</p>
    </div>
  );
}

export default Category;
