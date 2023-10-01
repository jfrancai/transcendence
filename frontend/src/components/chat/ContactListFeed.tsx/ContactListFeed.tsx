import { Contact } from '../../../utils/hooks/useStatus';
import { ContactCard } from '../ContactCard/ContactCard';
import { Scrollable } from '../Scrollable/Scrollable';

interface ContactListProps {
  contactList: Contact[];
  toggleConversationView: () => any;
  setContact: (p: any) => any;
  isChatClosed: boolean;
}

export function ContactListFeed({
  contactList,
  setContact,
  toggleConversationView,
  isChatClosed
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
    <Scrollable>
      <div className={`mt-28 ${isChatClosed ? '' : 'h-[758px] max-h-[90vh]'}`}>
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
                url="starwatcher.jpg"
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
                url="starwatcher.jpg"
              />
            ))}
          </>
        ) : null}
      </div>
    </Scrollable>
  );
}
