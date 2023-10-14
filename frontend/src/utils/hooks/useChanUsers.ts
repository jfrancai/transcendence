import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Contact, ContactList, User } from './useStatus.interfaces';

interface UseChanUsersType {
  contactList: ContactList;
  bannedList: ContactList;
}

export function useChanUsers(
  callback: (...arg: any) => any,
  chanID: string
): UseChanUsersType {
  const { socket } = useSocketContext();
  const [contactList, setContactList] = useState<ContactList>([]);
  const [bannedList, setBannedList] = useState<ContactList>([]);

  useEffect(() => {
    const onChannelMembers = (data: ContactList) => {
      setContactList(data);
    };

    const onUsersBanned = (data: ContactList) => {
      if (data.find((c) => c.userID === socket.userID)) {
        setBannedList([]);
      } else {
        setBannedList(data);
      }
    };

    const onChannelUserJoin = (data: Contact) => {
      if (chanID === data.chanID) {
        setContactList((list) => list.concat(data));
      }
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
    socket.on('usersBanned', onUsersBanned);
    socket.on('channelUserJoin', onChannelUserJoin);
    socket.on('channelLeave', onChannelLeave);
    socket.on('channelDelete', onChannelDelete);
    socket.on('channelMembers', onChannelMembers);
    return () => {
      socket.off('channelUserJoin', onChannelUserJoin);
      socket.off('usersBanned', onUsersBanned);
      socket.off('channelLeave', onChannelLeave);
      socket.off('channelDelete', onChannelDelete);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      socket.off('channelMembers', onChannelMembers);
    };
  }, [socket, callback]);

  return { contactList, bannedList };
}
