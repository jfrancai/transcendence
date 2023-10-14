import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Contact, ContactList } from './useStatus.interfaces';

export function useInviteList(): ContactList {
  const { socket } = useSocketContext();
  const [inviteList, setInviteList] = useState<ContactList>([]);

  const onInvitableMembers = (data: ContactList) => {
    setInviteList(data);
  };

  const onChannelInvite = (data: Contact) => {
    setInviteList((list) => list.filter((c) => c.userID !== data.userID));
  };

  useEffect(() => {
    socket.on('invitableMembers', onInvitableMembers);
    socket.on('channelInvite', onChannelInvite);
    return () => {
      socket.off('invitableMembers', onInvitableMembers);
      socket.off('channelInvite', onChannelInvite);
    };
  }, [socket]);

  return inviteList;
}
