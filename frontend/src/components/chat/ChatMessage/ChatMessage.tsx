import { useState } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import ProfileButton from '../ProfileButton/ProfileButton';

/* Change the date type format */
interface ChatMessageProps {
  message: string;
  time: string;
  username: string;
  profilePictureUrl: string;
  noBgColor?: boolean;
}

function ChatMessage({
  message,
  time,
  username,
  profilePictureUrl,
  noBgColor
}: ChatMessageProps) {
  const [clicked, setClicked] = useState(false);
  return (
    <div
      className={`${noBgColor ? '' : 'bg-pong-blue-400'}
        mx-2 my-1 flex w-80 flex-shrink-0 rounded-lg p-3 text-left `}
      onClick={() => setClicked(!clicked)}
      role="presentation"
    >
      <ProfilePicture size="xs" url={profilePictureUrl} />
      <div className="w-1 flex-grow cursor-pointer break-words px-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-pong-blue-100">{username}</p>
          <p className="text-sm font-bold text-pong-blue-100">{time}</p>
        </div>
        {clicked ? (
          <div className="flex justify-center">
            <ProfileButton className="mt-3" />
          </div>
        ) : (
          <p className="mt-3 text-base text-pong-white">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
