import { useEffect, useMemo, useState } from 'react';
import {
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
    const onPrivateMessage = (data: Message) => {
      setStatus((s) => ({
        ...s,
        privateMessage: data
      }));
    };

    const onSession = (data: Session) => {
      socket.userID = data.userID;
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

    socket.on('privateMessage', onPrivateMessage);
    socket.on('session', onSession);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);

    return () => {
      socket.off('privateMessage', onPrivateMessage);
      socket.off('session', onSession);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      setStatus(defaultStatus);
    };
  }, [defaultStatus]);

  return status;
}
