import { useEffect } from 'react';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { useSession } from '../../utils/hooks/useSession';
import { PrivateMessage } from '../../components/chat/PrivateMessage/PrivateMessage';
import { Channel } from '../../components/chat/Channel/Channel';
import { StateContextProvider, useStateContext } from '../../contexts/state';

function ChatWrapped() {
  const { socket } = useSocketContext();
  const { isChatClosed, isSearchView, isNotificationView } = useStateContext();

  useSession((data) => {
    socket.userID = data.userID;
  });

  useEffect(() => {
    socket.emit('session');
  }, [socket]);

  const chatHeaderStyle = isChatClosed
    ? 'static bg-pong-blue-300'
    : ' absolute backdrop-blur';
  return (
    <div className="absolute bottom-2 right-2 z-30 w-[336px] overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader className={`z-40 ${chatHeaderStyle}`} />
      <PrivateMessage />
      <Channel />
      <RenderIf some={[isSearchView]}>
        <p className="text-white">searchView</p>
      </RenderIf>
      <RenderIf some={[isNotificationView]}>
        <p className="text-white">notificationView</p>
      </RenderIf>
      <MenuSelector />
    </div>
  );
}

function Chat() {
  return (
    <StateContextProvider>
      <SocketContextProvider>
        <ChatWrapped />
      </SocketContextProvider>
    </StateContextProvider>
  );
}

export default Chat;
