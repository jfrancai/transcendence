import { useEffect, useState } from 'react';
import { Contact, ContactList } from './useStatus';

export function useContact(contactList: ContactList, isConnected: boolean) {
  const [contact, setContact] = useState<Contact>();

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
