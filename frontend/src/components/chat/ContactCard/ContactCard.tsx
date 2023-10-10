import { Tooltip } from 'react-tooltip';
import { BiMessageDetail } from 'react-icons/bi';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { useState } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { useOutsideClick } from '../../../utils/hooks/useOutsideClick';

interface ContactCardProps {
  sendMessage: () => any;
  blockUser: () => any;
  unblockUser: () => any;
  noBgColor?: boolean;
  userID: string;
  username: string;
  url: string;
  blocked: boolean;
}

export function ContactCard({
  sendMessage,
  userID,
  username,
  noBgColor,
  url,
  blockUser,
  unblockUser,
  blocked
}: ContactCardProps) {
  const [clicked, setClicked] = useState(false);
  const ref = useOutsideClick(() => setClicked(false));
  return (
    <>
      <div
        className={`mx-2 my-1 flex flex-shrink-0 items-center justify-between ${
          noBgColor ? 'bg-pong-blue-400' : ''
        } p-3 text-left`}
        role="presentation"
        onContextMenu={(e) => {
          e.preventDefault();
          setClicked(true);
        }}
        key={userID}
      >
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture size="xs" url={url} />
          <p className="semibold max-w-[200px] break-all text-base text-pong-white">
            {username}
          </p>
        </div>
        <div ref={ref} className="flex flex-row gap-4">
          {!blocked ? (
            <>
              <button type="button" onClick={sendMessage}>
                <BiMessageDetail className="userMessage h-6 w-6 text-pong-blue-100 " />
              </button>
              <Tooltip
                disableStyleInjection
                className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
                anchorSelect=".userMessage"
                clickable
                place="bottom"
              >
                <p className="font-semibold">Message user</p>
              </Tooltip>
            </>
          ) : null}
          {clicked || blocked ? (
            <>
              <button type="button" onClick={blocked ? unblockUser : blockUser}>
                {blocked ? (
                  <BsEyeSlash className="userBlock h-5 w-5 text-pong-blue-100" />
                ) : (
                  <BsEye className="userBlock h-5 w-5 text-pong-blue-100" />
                )}
              </button>
              <Tooltip
                disableStyleInjection
                className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
                anchorSelect=".userBlock"
                clickable
                place="bottom"
              >
                <p className="font-semibold">Unblock user</p>
              </Tooltip>
            </>
          ) : null}
        </div>
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
