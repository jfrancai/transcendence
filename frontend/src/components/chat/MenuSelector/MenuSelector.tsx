import { Tooltip } from 'react-tooltip';
import { BiBell, BiMessageDetail } from 'react-icons/bi';
import { MdOutlineGroups } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import RenderIf from '../RenderIf/RenderIf';
import { useStateContext } from '../../../contexts/state';

export default function MenuSelector() {
  const {
    isMessageView,
    isSearchView,
    isNotificationView,
    isChannelSettings,
    isChannelView,
    toggleMessageView,
    toggleChannelView
  } = useStateContext();
  return (
    <RenderIf
      some={[
        isMessageView,
        isChannelSettings,
        isSearchView,
        isNotificationView,
        isChannelSettings
      ]}
    >
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
              isChannelView || isChannelSettings
                ? 'text-pong-white'
                : 'text-pong-blue-100'
            }`}
          />
        </button>
        <button type="button" onClick={() => {}}>
          <AiOutlineSearch
            className={`comingsoon h-6 w-6 ${
              isSearchView ? 'text-pong-white' : 'text-pong-blue-100'
            }`}
          />
        </button>
        <button type="button" onClick={() => {}}>
          <BiBell
            className={`comingsoon h-6 w-6
          ${isNotificationView ? 'text-pong-white' : 'text-pong-blue-100'}`}
          />
        </button>
        <Tooltip
          disableStyleInjection
          className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100"
          anchorSelect=".comingsoon"
          clickable
          place="bottom"
        >
          <p className="font-semibold">coming soon</p>
        </Tooltip>
        <button type="button">
          <ProfilePicture size="xs" />
        </button>
      </div>
    </RenderIf>
  );
}
