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
import { useSocketContext } from '../../../contexts/socket';

function ChatHeader() {
  const isConnected = useConnected();
  const { changeView, toggleArrow, isChatClosed } = useStateContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    connectSocket();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const chatHeaderStyle = isChatClosed
    ? 'static bg-pong-blue-300'
    : ' absolute backdrop-blur';

  return (
    <div
      className={`${chatHeaderStyle} z-40 flex w-[336px] items-center justify-center rounded-3xl`}
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
