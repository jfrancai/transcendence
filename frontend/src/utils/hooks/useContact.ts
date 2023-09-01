import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Contact, ContactList } from './useSocket';

export function useContact(
  contactList: ContactList,
  isConnected: boolean
): [Contact | undefined, Dispatch<SetStateAction<Contact | undefined>>] {
  const [contact, setContact] = useState<Contact>();

  useEffect(() => {
    if (isConnected) {
      contactList.forEach((c: Contact) => {
        if (c.userID === contact?.userID) {
          setContact(c);
        }
      });
    }
  }, [contactList]); // eslint-disable-line react-hooks/exhaustive-deps

  return [contact, setContact];
}

export default {};
