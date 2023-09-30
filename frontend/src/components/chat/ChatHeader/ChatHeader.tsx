import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import socket from '../../../services/socket';
import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';

interface ChatHeaderProps {
  className?: string;
  isConnected: boolean;
  isChatClosed: boolean;
  handleClick: {
    toggleArrow: () => any;
    changeView: () => any;
  };
}

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

function ChatHeader({
  className,
  isConnected,
  isChatClosed,
  handleClick
}: ChatHeaderProps) {
  const connect = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const decodedToken: DecodedToken = jwt_decode(jwt!);
      socket.auth = {
        token: jwt
      };
      socket.username = decodedToken.username;
      socket.connect();
    }
  };
  const disconnect = () => socket.disconnect();

  useEffect(() => {
    connect();
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
          onClick={isConnected ? disconnect : connect}
        />
      </div>
    </div>
  );
}

export default ChatHeader;
