import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Contact, ContactList } from './useStatus.interfaces';

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

    socket.on('channelUserJoin', onChannelUserJoin);
    socket.on('channelLeave', onChannelLeave);
    socket.on('channelDelete', onChannelDelete);
    socket.on('channelMembers', onChannelMembers);
    return () => {
      socket.off('channelUserJoin', onChannelUserJoin);
      socket.off('channelLeave', onChannelLeave);
      socket.off('channelDelete', onChannelDelete);
      socket.off('channelMembers', onChannelMembers);
    };
  }, [socket, callback]);

  return contactList;
}
