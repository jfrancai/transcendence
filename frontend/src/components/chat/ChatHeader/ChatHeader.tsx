import { useCallback, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';
import { useSocketContext } from '../../../contexts/socket';
import { useConnected } from '../../../utils/hooks/useConnected';

interface ChatHeaderProps {
  className?: string;
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

function ChatHeader({ className, isChatClosed, handleClick }: ChatHeaderProps) {
  const { socket } = useSocketContext();
  const isConnected = useConnected();

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
