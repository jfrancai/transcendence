import { useEffect } from 'react';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { useSession } from '../../utils/hooks/useSession';
import { PrivateMessage } from '../../components/chat/PrivateMessage/PrivateMessage';
import { Channel } from '../../components/chat/Channel/Channel';
import { StateContextProvider } from '../../contexts/state';
import { Search } from '../../components/chat/Search';
import { Notification } from '../../components/chat/Notification';

function ChatWrapped() {
  const { socket } = useSocketContext();

  useSession((data) => {
    socket.userID = data.userID;
  });

  useEffect(() => {
    socket.emit('session');
  }, [socket]);

  return (
    <div className="absolute bottom-2 right-2 z-30 overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader />
      <PrivateMessage />
      <Channel />
      <Search />
      <Notification />
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
