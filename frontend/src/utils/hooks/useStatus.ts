import { useEffect, useMemo, useState } from 'react';
import socket from '../../services/socket';

export interface Message {
  messageID: string;
  content: string;
  sender: string;
  senderID: string;
  receiver: string;
  receiverID: string;
  createdAt: Date;
}

function isPrivateMessage(data: any): data is Message {
  return (
    data.content !== undefined &&
    data.sender !== undefined &&
    data.senderID !== undefined &&
    data.receiverID !== undefined &&
    data.receiver !== undefined &&
    data.createdAt !== undefined &&
    data.messageID !== undefined
  );
}

export interface Session {
  userID: string;
}

function isSession(data: any): data is Session {
  return data.userID !== undefined;
}

export interface Contact {
  username: string;
  userID: string;
  messages: Message[];
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

export type ContactList = Contact[];

function isContactList(data: any): data is ContactList {
  if (Array.isArray(data)) {
    return data.some((d: any) => isContact(d) === false) === false;
  }
  return false;
}

export interface Status {
  isConnected: boolean;
  contactList: Contact[];
  privateMessage: Message | undefined;
}

export function useStatus(): Status {
  const defaultStatus = useMemo(
    () => ({
      isConnected: true,
      contactList: [],
      privateMessage: undefined
    }),
    []
  );
  const [status, setStatus] = useState<Status>(defaultStatus);

  useEffect(() => {
    const onConnect = () => setStatus((s) => ({ ...s, isConnected: true }));
    const onDisconnect = () => setStatus((s) => ({ ...s, isConnected: false }));
    const onPrivateMessage = (data: any) => {
      if (isPrivateMessage(data)) {
        setStatus((s) => ({
          ...s,
          privateMessage: data
        }));
      }
    };
    const onSession = (data: any) => {
      if (isSession(data)) {
        socket.userID = data.userID;
      }
    };
    const onUsers = (data: any) => {
      if (isContactList(data)) {
        const contactList = data.filter((d) => d.userID !== socket.userID);
        setStatus((s) => ({ ...s, contactList }));
      }
    };
    const onUserDisconnected = () => {};
    const onUserConnected = () => {};

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('privateMessage', onPrivateMessage);
    socket.on('session', onSession);
    socket.on('users', onUsers);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('privateMessage', onPrivateMessage);
      socket.off('session', onSession);
      socket.off('users', onUsers);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      setStatus(defaultStatus);
    };
  }, [defaultStatus]);

  return status;
}

export default {};
