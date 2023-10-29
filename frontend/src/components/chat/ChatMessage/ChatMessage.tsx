import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import SecondaryButton from '../../SecondaryButton/SecondaryButton';
import { useSocketContext } from '../../../contexts/socket';
import RenderIf from '../RenderIf/RenderIf';

/* Change the date type format */
interface ChatMessageProps {
  message: string;
  time: string;
  username: string;
  noBgColor?: boolean;
}

function ChatMessage({ message, time, username, noBgColor }: ChatMessageProps) {
  const { socket } = useSocketContext();
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleInvite = () => {
    navigate(`/pong/${username}`);
  };
  return (
    <div
      className={`${noBgColor ? '' : 'bg-pong-blue-400'}
        mx-2 my-1 flex flex-shrink-0 rounded-lg p-3 text-left `}
      onClick={() => setClicked(!clicked)}
      role="presentation"
    >
      <ProfilePicture size="xs" />
      <div className="w-1 flex-grow cursor-pointer break-words px-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-pong-blue-100">{username}</p>
          <p className="text-sm font-bold text-pong-blue-100">{time}</p>
        </div>
        {clicked ? (
          <div className="flex justify-center gap-5">
            <SecondaryButton className="mt-3" span="Profile" />
            <RenderIf some={[username !== socket.username]}>
              <SecondaryButton
                onClick={handleInvite}
                className="mt-3"
                span="Invite"
              />
            </RenderIf>
          </div>
        ) : (
          <p className="mt-3 text-base text-pong-white">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
