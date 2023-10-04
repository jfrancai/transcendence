import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { ContactList, User } from './useStatus.interfaces';

export function useUsers(): ContactList {
  const { socket } = useSocketContext();
  const [contactList, setContactList] = useState<ContactList>([]);

  useEffect(() => {
    const onChannelMembers = (data: ContactList) => {
      setContactList(data);
    };
    const onUsers = (data: ContactList) => {
      setContactList(data.filter((d) => d.userID !== socket.userID));
    };
    const onUserDisconnected = (data: User) => {
      setContactList((list) => {
        const newList = list.map((c) => {
          if (c.userID === data.userID) {
            return { ...c, connected: false };
          }
          return c;
        });
        return newList.filter((d) => d.userID !== socket.userID);
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
        return newList.filter((d) => d.userID !== socket.userID);
      });
    };

    socket.on('users', onUsers);
    socket.on('channelMembers', onChannelMembers);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    return () => {
      socket.off('users', onUsers);
      socket.off('channelMembers', onChannelMembers);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
    };
  }, [socket]);

  return contactList;
}
