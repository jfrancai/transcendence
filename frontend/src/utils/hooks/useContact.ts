import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Contact } from './useStatus.interfaces';
import { useConnected } from './useConnected';
import { useUsers } from './useUsers';

export function useContact(): [
  Contact | undefined,
  Dispatch<SetStateAction<Contact | undefined>>
] {
  const isConnected = useConnected();
  const contactList = useUsers();
  const [contact, setContact] = useState<Contact | undefined>();

  useEffect(() => {
    if (isConnected) {
      contactList.forEach((c: Contact) => {
        if (c.userID === contact?.userID) {
          setContact(c);
        }
      });
    }
  }, [contactList, isConnected, contact?.userID]);

  return [contact, setContact];
}

export default {};
