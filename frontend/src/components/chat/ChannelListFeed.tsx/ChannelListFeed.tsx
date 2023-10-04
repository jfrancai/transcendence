import { useEffect } from 'react';
import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { useUsers } from '../../../utils/hooks/useUsers';
import { ContactCard } from '../ContactCard/ContactCard';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';

interface ContactListProps {
  toggleConversationView: () => any;
  setChanID: (p: any) => any;
}

export function ChannelListFeed({
  setChanID,
  toggleConversationView
}: ContactListProps) {
  const { socket } = useSocketContext();
  const contactList = useUsers();

  useEffect(() => {
    socket.emit('users');
  }, [socket]);

  const online: ContactList = [];
  const offline: ContactList = [];

  contactList.forEach((user) => {
    if (user.connected === true) {
      online.push(user);
    } else {
      offline.push(user);
    }
  });
  const displayCard = (user: Contact) => (
    <ContactCard
      key={user.userID}
      username={user.username}
      userID={user.userID}
      onClick={() => {
        setChanID(user.userID);
        toggleConversationView();
      }}
      url="starwatcher.jpg"
    />
  );
  return (
    <Scrollable>
      <div className="pt-28">
        {online.length ? (
          <>
            <p className="pl-2 font-semibold text-pong-blue-100">
              {`ONLINE — ${online.length}`}
            </p>
            {online.map(displayCard)}
          </>
        ) : null}
        {offline.length ? (
          <>
            <p className="mt-3 pl-2 font-bold text-pong-blue-100">
              {`OFFLINE — ${offline.length}`}
            </p>
            {offline.map(displayCard)}
          </>
        ) : null}
      </div>
    </Scrollable>
  );
}
