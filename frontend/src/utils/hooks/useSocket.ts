import { useEffect, useState } from 'react';
import socket from '../../services/socket';

export interface PrivateMessage {
  content: string;
  from: string;
  to: string;
  date: Date;
  messageID: string;
}

function isPrivateMessage(data: any): data is PrivateMessage {
  return (
    data.content !== undefined &&
    data.from !== undefined &&
    data.to !== undefined &&
    data.date !== undefined &&
    data.messageID !== undefined
  );
}

interface Session {
  sessionID: string;
  userID: string;
}

function isSession(data: any): data is Session {
  return data.sessionID !== undefined && data.userID !== undefined;
}

interface Contact {
  username: string;
  userID: string;
  messages: PrivateMessage[];
  connected: boolean;
}

function isContact(data: any): data is Contact {
  return (
    data.username !== undefined &&
    data.userID !== undefined &&
    data.messages !== undefined &&
    data.connected !== undefined
  );
}

type ContactList = Contact[];

function isContactList(data: any): data is ContactList {
  if (Array.isArray(data)) {
    return data.some((d: any) => isContact(d) === false) === false;
  }
  return false;
}

export function useSocket(setIsConnected: any) {
  const [privateMessage, setPrivateMessage] = useState<
    PrivateMessage | undefined
  >(undefined);
  const [contactList, setContactList] = useState<any>([]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onPrivateMessage = (data: any) => {
      if (isPrivateMessage(data)) {
        setPrivateMessage({
          content: data.content,
          from: data.from,
          to: data.to,
          date: data.date,
          messageID: data.messageID
        });
      }
    };

    const onSession = (data: any) => {
      if (isSession(data)) {
        const { userID, sessionID } = data;
        localStorage.setItem('sessionID', sessionID);
        socket.userID = userID;
      }
    };

    const onUsers = (data: any) => {
      if (isContactList(data)) {
        setContactList(data);
      }
    };

    const onUserDisconnected = () => {};

    const onUserConnected = () => {};

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('private message', onPrivateMessage);
    socket.on('session', onSession);
    socket.on('users', onUsers);
    socket.on('user connected', onUserConnected);
    socket.on('user disconnected', onUserDisconnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('private message', onPrivateMessage);
      socket.off('session', onSession);
      socket.off('users', onUsers);
      socket.off('user connected', onUserConnected);
      socket.off('user disconnected', onUserDisconnected);
    };
  }, [setPrivateMessage, setContactList, setIsConnected]);

  return [privateMessage, contactList];
}

export default {};
