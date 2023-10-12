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
  isBanned?: boolean;
  adminSection?: boolean;
}

export function ChannelList({
  list,
  title,
  chanID,
  isCreator,
  isAdmin,
  isBanned = false,
  adminSection = false
}: ChannelListProps) {
  const { socket } = useSocketContext();
  const displayCard = (user: Contact) => (
    <ChanContact
      key={user.userID}
      username={user.username}
      userID={user.userID}
      chanID={chanID}
      url="starwatcher.jpg"
      isCreator={isCreator}
      isAdmin={isAdmin && user.userID !== socket.userID}
      adminSection={adminSection}
      isBanned={isBanned}
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
