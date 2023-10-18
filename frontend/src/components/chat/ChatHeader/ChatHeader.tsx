import { useEffect } from 'react';
import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';
import { useConnected } from '../../../utils/hooks/useConnected';
import {
  connectSocket,
  disconnectSocket
} from '../../../utils/functions/socket';
import { useStateContext } from '../../../contexts/state';

interface ChatHeaderProps {
  className?: string;
}

function ChatHeader({ className }: ChatHeaderProps) {
  const isConnected = useConnected();
  const { changeView, toggleArrow, isChatClosed } = useStateContext();

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div
      className={`${className} flex w-[336px] items-center justify-center rounded-3xl`}
    >
      <div className="flex flex-wrap content-center items-center justify-center gap-x-24 gap-y-2 rounded-3xl py-5">
        <Category onClick={changeView} type="chat" />
        <ArrowToggler up={isChatClosed} onClick={toggleArrow} />
        <Status
          position="start"
          severity={isConnected ? 'ok' : 'err'}
          message={isConnected ? 'Connected' : 'Disconnected'}
          onClick={isConnected ? disconnectSocket : connectSocket}
        />
      </div>
    </div>
  );
}

export default ChatHeader;
