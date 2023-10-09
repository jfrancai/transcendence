import { useSocketContext } from '../../../contexts/socket';
import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { ChanContact } from '../ChanContact/ChanContact';

interface ChannelListProps {
  list: ContactList;
  title: string;
  chanID: string;
  isCreator: boolean;
  isAdmin: boolean;
  adminSection?: boolean;
}

export function ChannelList({
  list,
  title,
  chanID,
  isCreator,
  isAdmin,
  adminSection = false
}: ChannelListProps) {
  const { socket } = useSocketContext();
  const displayCard = (user: Contact) => (
    <ChanContact
      key={user.userID}
      username={user.username}
      url="starwatcher.jpg"
      addAdmin={() => {
        socket.emit('channelAddAdmin', {
          usersID: [user.userID],
          chanID
        });
      }}
      removeAdmin={() => {
        socket.emit('channelRemoveAdmin', {
          usersID: [user.userID],
          chanID
        });
      }}
      kickUser={() => {
        socket.emit('channelRestrict', {
          userID: user.userID,
          chanID,
          restrictType: 'KICK',
          reason: 'You have been kick'
        });
      }}
      isCreator={isCreator}
      isAdmin={isAdmin}
      adminSection={adminSection}
    />
  );

  if (list.length) {
    return (
      <div>
        <p className="pl-2 font-semibold text-pong-blue-100">{title}</p>
        {list.map(displayCard)}
      </div>
    );
  }
  return null;
}
