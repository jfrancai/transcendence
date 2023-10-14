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
  setUserID: (p: any) => any;
}

export function ContactListFeed({
  setUserID,
  toggleConversationView
}: ContactListProps) {
  const { socket } = useSocketContext();
  const { contactList, blockedList } = useUsers();

  useEffect(() => {
    socket.emit('users');
    socket.emit('usersBlocked');
  }, [socket]);

  const online: ContactList = [];
  const offline: ContactList = [];

  contactList
    .filter((d) => d.userID !== socket.userID)
    .forEach((user) => {
      if (user.connected === true) {
        online.push(user);
      } else {
        offline.push(user);
      }
    });

  return (
    <Scrollable>
      {online.length ? (
        <>
          <p className="pl-2 font-semibold text-pong-blue-100">
            {`ONLINE — ${online.length}`}
          </p>
          {online.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              url="starwatcher.jpg"
              blocked={false}
            />
          ))}
        </>
      ) : null}
      {offline.length ? (
        <>
          <p className="mt-3 pl-2 font-bold text-pong-blue-100">
            {`OFFLINE — ${offline.length}`}
          </p>
          {offline.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              userID={user.userID}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              url="starwatcher.jpg"
              blocked={false}
            />
          ))}
        </>
      ) : null}
      {blockedList.length ? (
        <>
          <p className="mt-3 pl-2 font-bold text-pong-blue-100">
            {`BLOCKED — ${blockedList.length}`}
          </p>
          {blockedList.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              userID={user.userID}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              url="starwatcher.jpg"
              blocked
            />
          ))}
        </>
      ) : null}
    </Scrollable>
  );
}
