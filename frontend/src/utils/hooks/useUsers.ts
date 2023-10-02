import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { ContactList } from './useStatus.interfaces';

export function useUsers(): ContactList {
  const { socket } = useSocketContext();
  const [contactList, setContactList] = useState<ContactList>([]);

  useEffect(() => {
    const onUsers = (data: ContactList) => {
      const list = data.filter((d) => d.userID !== socket.userID);
      setContactList(list);
    };

    socket.on('users', onUsers);
    return () => {
      socket.off('users', onUsers);
    };
  });

  return contactList;
}
