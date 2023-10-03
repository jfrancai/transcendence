import { useEffect } from 'react';
import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';
import { useConnected } from '../../../utils/hooks/useConnected';
import {
  connectSocket,
  disconnectSocket
} from '../../../utils/functions/socket';

interface ChatHeaderProps {
  className?: string;
  isChatClosed: boolean;
  handleClick: {
    toggleArrow: () => any;
    changeView: () => any;
  };
}

function ChatHeader({ className, isChatClosed, handleClick }: ChatHeaderProps) {
  const isConnected = useConnected();

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div
      className={`${className} flex w-[336px] items-center justify-center rounded-3xl`}
    >
      <div className="flex flex-wrap content-center items-center justify-center gap-x-24 gap-y-2 rounded-3xl py-5">
        <Category onClick={handleClick.changeView} type="chat" />
        <ArrowToggler up={isChatClosed} onClick={handleClick.toggleArrow} />
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
