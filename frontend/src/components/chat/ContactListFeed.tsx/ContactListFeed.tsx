import { Contact } from '../../../utils/hooks/useStatus';
import { ContactCard } from '../ContactCard/ContactCard';

interface ContactListProps {
  contactList: Contact[];
  toggleConversationView: () => any;
  setContact: (p: any) => any;
  socketID: string;
}

export function ContactListFeed({
  contactList,
  setContact,
  toggleConversationView,
  socketID
}: ContactListProps) {
  return (
    <div>
      {contactList
        ?.filter((user) => user.userID !== socketID)
        .map((user, index: number) => {
          if (index % 2) {
            return (
              <ContactCard
                username={user.username}
                userID={user.userID}
                toggleConversationView={toggleConversationView}
                setContact={() => setContact(user)}
              />
            );
          }
          return (
            <ContactCard
              username={user.username}
              userID={user.userID}
              toggleConversationView={toggleConversationView}
              setContact={() => setContact(user)}
              noBgColor
            />
          );
        })}
    </div>
  );
}
