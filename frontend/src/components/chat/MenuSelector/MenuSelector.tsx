import { BiBell, BiMessageDetail } from 'react-icons/bi';
import { MdOutlineGroups } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

export default function MenuSelector() {
  return (
    <div className="flex h-14 w-[336px] flex-shrink-0 items-center justify-between gap-y-24 bg-pong-blue-400 px-5">
      <button type="button">
        <BiMessageDetail className="h-6 w-6 text-pong-blue-100" />
      </button>
      <button type="button">
        <MdOutlineGroups className="h-6 w-6 text-pong-blue-100" />
      </button>
      <button type="button">
        <AiOutlineSearch className="h-6 w-6 text-pong-blue-100" />
      </button>
      <button type="button">
        <BiBell className="h-6 w-6 text-pong-blue-100" />
      </button>
      <button type="button">
        <ProfilePicture size="xs" url="starwatcher.jpg" />
      </button>
    </div>
  );
}
