import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Contact, ContactList, User } from './useStatus.interfaces';

export function useUsers(callback: (...arg: any) => any): ContactList {
  const { socket } = useSocketContext();
  const [contactList, setContactList] = useState<ContactList>([]);

  useEffect(() => {
    const onChannelMembers = (data: ContactList) => {
      setContactList(data);
    };

    const onChannelUserJoin = (data: Contact) => {
      setContactList((list) => list.concat(data));
    };

    const onChannelLeave = (data: { chanID: string; userID: string }) => {
      if (data.userID !== socket.userID) {
        setContactList((list) => list.filter((c) => c.userID !== data.userID));
      } else {
        callback();
        setContactList([]);
      }
    };

    const onChannelDelete = () => {
      callback();
      setContactList([]);
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
    socket.on('channelUserJoin', onChannelUserJoin);
    socket.on('channelLeave', onChannelLeave);
    socket.on('channelDelete', onChannelDelete);
    socket.on('channelMembers', onChannelMembers);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    return () => {
      socket.off('users', onUsers);
      socket.off('channelUserJoin', onChannelUserJoin);
      socket.off('channelLeave', onChannelLeave);
      socket.off('channelDelete', onChannelDelete);
      socket.off('channelMembers', onChannelMembers);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
    };
  }, [socket, callback]);

  return contactList;
}
