import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { ContactList, User } from './useStatus.interfaces';

export function useUsers(): ContactList {
  const { socket } = useSocketContext();
  const [contactList, setContactList] = useState<ContactList>([]);

  useEffect(() => {
    const onUsers = (data: ContactList) => {
      const list = data.filter((d) => d.userID !== socket.userID);
      setContactList(list);
    };
    const onUserDisconnected = (data: User) => {
      setContactList((list) => {
        const newList = list.map((c) => {
          if (c.userID === data.userID) {
            return { ...c, connected: false };
          }
          return c;
        });
        return newList;
      });
    };

    const onUserConnected = (data: User) => {
      setContactList((list) => {
        const newList = list.map((c) => {
          if (c.userID === data.userID) {
            return { ...c, connected: true };
          }
          return c;
        });
        return newList;
      });
    };

    socket.on('users', onUsers);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    return () => {
      socket.off('users', onUsers);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
    };
  });

  return contactList;
}
