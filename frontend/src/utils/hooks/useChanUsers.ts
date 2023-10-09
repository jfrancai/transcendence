import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Contact, ContactList, User } from './useStatus.interfaces';

export function useChanUsers(callback: (...arg: any) => any): ContactList {
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

    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);

    socket.on('channelUserJoin', onChannelUserJoin);
    socket.on('channelLeave', onChannelLeave);
    socket.on('channelDelete', onChannelDelete);
    socket.on('channelMembers', onChannelMembers);
    return () => {
      socket.off('channelUserJoin', onChannelUserJoin);
      socket.off('channelLeave', onChannelLeave);
      socket.off('channelDelete', onChannelDelete);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      socket.off('channelMembers', onChannelMembers);
    };
  }, [socket, callback]);

  return contactList;
}
