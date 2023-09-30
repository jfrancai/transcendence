import { Contact } from '../../../utils/hooks/useStatus';
import { ContactCard } from '../ContactCard/ContactCard';

interface ContactListProps {
  contactList: Contact[];
  toggleConversationView: () => any;
  setContact: (p: any) => any;
}

export function ContactListFeed({
  contactList,
  setContact,
  toggleConversationView
}: ContactListProps) {
  const online: Contact[] = [];
  const offline: Contact[] = [];
  contactList.forEach((user) => {
    if (user.connected === true) {
      online.push(user);
    } else {
      offline.push(user);
    }
  });
  return (
    <div>
      {online.length ? (
        <>
          <p className="pl-2 font-semibold text-pong-blue-100">
            {`ONLINE — ${online.length}`}
          </p>
          {online.map((user) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              userID={user.userID}
              toggleConversationView={toggleConversationView}
              setContact={() => setContact(user)}
            />
          ))}
        </>
      ) : null}
      {offline.length ? (
        <>
          <p className="mt-3 pl-2 font-bold text-pong-blue-100">
            {`OFFLINE — ${offline.length}`}
          </p>
          {offline.map((user) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              userID={user.userID}
              toggleConversationView={toggleConversationView}
              setContact={() => setContact(user)}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
