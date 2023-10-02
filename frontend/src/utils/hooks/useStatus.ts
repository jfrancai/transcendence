import { useEffect, useMemo, useState } from 'react';
import {
  Channel,
  ContactList,
  Message,
  Session,
  Status,
  User
} from './useStatus.interfaces';
import { socket } from '../functions/socket';

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
    const onConnect = () => {
      /* eslint-disable */
      console.log('connected');
      /* eslint-enable */
      setStatus((s) => ({ ...s, isConnected: true }));
    };

    const onDisconnect = () => {
      /* eslint-disable */
      console.log('disconnected');
      /* eslint-enable */
      setStatus((s) => ({ ...s, isConnected: false }));
    };

    const onPrivateMessage = (data: Message) => {
      setStatus((s) => ({
        ...s,
        privateMessage: data
      }));
    };

    const onSession = (data: Session) => {
      socket.userID = data.userID;
    };

    const onUsers = (data: ContactList) => {
      const contactList = data.filter((d) => d.userID !== socket.userID);
      setStatus((s) => ({ ...s, contactList }));
    };

    const onUserDisconnected = (data: User) => {
      setStatus((s) => ({
        ...s,
        contactList: s.contactList.map((c) => {
          if (c.userID === data.userID) {
            return { ...c, connected: false };
          }
          return c;
        })
      }));
    };

    const onUserConnected = (data: User) => {
      setStatus((s) => ({
        ...s,
        contactList: s.contactList.map((c) => {
          if (c.userID === data.userID) {
            return { ...c, connected: true };
          }
          return c;
        })
      }));
    };

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
