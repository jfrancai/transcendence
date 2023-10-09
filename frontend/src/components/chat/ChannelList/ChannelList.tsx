import { socket } from '../../../utils/functions/socket';
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
}

export function ChannelList({
  list,
  title,
  chanID,
  isCreator,
  isAdmin
}: ChannelListProps) {
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
      isCreator={isCreator}
      isAdmin={isAdmin}
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
