import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { ContactList, User } from './useStatus.interfaces';

export function useUsers(): {
  contactList: ContactList;
  blockedList: ContactList;
} {
  const { socket } = useSocketContext();
  const [contactList, setContactList] = useState<ContactList>([]);
  const [blockedList, setBlockedList] = useState<ContactList>([]);

  useEffect(() => {
    const onUsers = (data: ContactList) => {
      setContactList(data.filter((d) => d.userID !== socket.userID));
    };

    const onUsersBlocked = (data: ContactList) => {
      setBlockedList(data.filter((d) => d.userID !== socket.userID));
    };

    const onBlockUser = () => {
      socket.emit('users');
      socket.emit('usersBlocked');
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
    socket.on('usersBlocked', onUsersBlocked);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    socket.on('blockUser', onBlockUser);
    return () => {
      socket.off('users', onUsers);
      socket.off('usersBlocked', onUsersBlocked);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      socket.off('blockUser', onBlockUser);
    };
  }, [socket]);

  return { contactList, blockedList };
}
