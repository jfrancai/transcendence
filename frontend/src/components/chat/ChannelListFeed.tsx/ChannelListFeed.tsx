import { useEffect } from 'react';
import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { useUsers } from '../../../utils/hooks/useUsers';
import { ContactCard } from '../ContactCard/ContactCard';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';
import { useChanInfo } from '../../../utils/hooks/useChannelInfo';

interface ContactListProps {
  toggleConversationView: () => any;
  chanName: string | undefined;
}

export function ChannelListFeed({
  chanName,
  toggleConversationView
}: ContactListProps) {
  const { socket } = useSocketContext();
  const contactList = useUsers();
  const channel = useChanInfo();

  useEffect(() => {
    if (chanName) {
      socket.emit('channelMembers', { chanName });
      socket.emit('channelInfo', { chanName });
    }
  }, [socket, chanName]);

  const admins: ContactList = [];
  const online: ContactList = [];
  const offline: ContactList = [];

  contactList.forEach((user) => {
    if (channel && user.connected === true) {
      if (channel.chanAdmins.find((a) => a === user.userID)) {
        admins.push(user);
      } else {
        online.push(user);
      }
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
        toggleConversationView();
      }}
      url="starwatcher.jpg"
    />
  );
  return (
    <div className="w-full">
      <Scrollable>
        <div className="flex flex-col gap-3 pt-28">
          {admins.length ? (
            <div>
              <p className="pl-2 font-semibold text-pong-blue-100">
                {`ADMINS — ${admins.length}`}
              </p>
              {admins.map(displayCard)}
            </div>
          ) : null}
          {online.length ? (
            <div>
              <p className="pl-2 font-semibold text-pong-blue-100">
                {`ONLINE — ${online.length}`}
              </p>
              {online.map(displayCard)}
            </div>
          ) : null}
          {offline.length ? (
            <div>
              <p className="pl-2 font-bold text-pong-blue-100">
                {`OFFLINE — ${offline.length}`}
              </p>
              {offline.map(displayCard)}
            </div>
          ) : null}
        </div>
      </Scrollable>
    </div>
  );
}
