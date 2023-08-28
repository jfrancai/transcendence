import { useEffect, useRef, useState } from 'react';
import socket from '../../services/socket';
import ChatFeed, { ChatInfo } from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';

interface Message {
  content: string;
  messageID: string;
  from: string;
  to: string;
}

interface Session {
  sessionID: string;
  userID: string;
}

function Chat() {
  const messageEndRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<ChatInfo[]>([]);
  const [close, setClose] = useState<boolean>(true);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onPrivateMessage = (value: Message) => {
      const chatInfo: ChatInfo = {
        username: 'toto',
        time: '14:00pm',
        message: value.content,
        profilePictureUrl: 'starwatcher.jpg',
        level: 42,
        messageID: value.messageID
      };
      setMessages((previous) => [...previous, chatInfo]);
    };
    const onSession = ({ sessionID, userID }: Session) => {
      localStorage.setItem('sessionID', sessionID);
      socket.userID = userID;
    };
    const onUsers = (users: any) => {
      const sender = users.find((user: any) => user.userID !== socket.userID);
      let msgs: any = [];
      sender.messages.map((message: any) => {
        msgs = [
          ...msgs,
          {
            messageID: message.messageID,
            message: message.content,
            time: '10:00 pm',
            username: sender.username,
            level: 42,
            profilePictureUrl: 'starwatcher.jpg'
          }
        ];
        return message;
      });
      setMessages(() => msgs);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('private message', onPrivateMessage);
    socket.on('session', onSession);
    socket.on('users', onUsers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('private message', onPrivateMessage);
      socket.off('session', onSession);
      socket.off('users', onUsers);
    };
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-fit overflow-hidden rounded-3xl">
      <div
        className={`hide-scrollbar ${
          close ? '' : 'h-[758px]'
        }  w-fit shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300`}
      >
        <ChatHeader
          className="absolute z-30"
          isConnected={isConnected}
          handleClick={() => setClose(!close)}
        />
        <div className="invisible h-24">
          <ChatMessage
            message=""
            time=""
            username=""
            level={0}
            profilePictureUrl=""
          />
        </div>
        <Hide condition={close}>
          <ChatFeed messages={messages} />
          <div ref={messageEndRef} />
        </Hide>
      </div>
      <Hide condition={close}>
        <SendMessageInput />
      </Hide>
    </div>
  );
}

export default Chat;
