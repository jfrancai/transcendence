import { BiBell, BiMessageDetail } from 'react-icons/bi';
import { MdOutlineGroups } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface MenuSelectorProps {
  isMessageView: boolean;
  isChannelView: boolean;
  isSearchView: boolean;
  isNotificationView: boolean;
  toggleMessageView: () => any;
  toggleChannelView: () => any;
  toggleSearchView: () => any;
  toggleNotificationView: () => any;
}

export default function MenuSelector({
  isMessageView,
  isChannelView,
  isSearchView,
  isNotificationView,
  toggleMessageView,
  toggleChannelView,
  toggleSearchView,
  toggleNotificationView
}: MenuSelectorProps) {
  return (
    <div className="flex h-14 w-[336px] flex-shrink-0 items-center justify-between gap-y-24 bg-pong-blue-400 px-5">
      <button type="button" onClick={toggleMessageView}>
        <BiMessageDetail
          className={`h-6 w-6 ${
            isMessageView ? 'text-pong-white' : 'text-pong-blue-100'
          } `}
        />
      </button>
      <button type="button" onClick={toggleChannelView}>
        <MdOutlineGroups
          className={`h-6 w-6 ${
            isChannelView ? 'text-pong-white' : 'text-pong-blue-100'
          }`}
        />
      </button>
      <button type="button" onClick={toggleSearchView}>
        <AiOutlineSearch
          className={`h-6 w-6 ${
            isSearchView ? 'text-pong-white' : 'text-pong-blue-100'
          }`}
        />
      </button>
      <button type="button" onClick={toggleNotificationView}>
        <BiBell
          className={`h-6 w-6
          ${isNotificationView ? 'text-pong-white' : 'text-pong-blue-100'}`}
        />
      </button>
      <button type="button">
        <ProfilePicture size="xs" url="starwatcher.jpg" />
      </button>
    </div>
  );
}
