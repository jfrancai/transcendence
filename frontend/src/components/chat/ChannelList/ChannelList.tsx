import { useSocketContext } from '../../../contexts/socket';
import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { BanButton, rBanButton } from '../BanButton';
import { ChanContact } from '../ChanContact/ChanContact';
import { KickButton } from '../KickButton';
import { ToggleAdmin } from '../ToggleAdmin';
import { UnbanButton } from '../UnbanButton';

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
  const displayCard = (user: Contact) => {
    const isAdm = isAdmin && user.userID !== socket.userID;
    const { userID } = user;
    if (isBanned) {
      return (
        <ChanContact
          key={user.userID}
          username={user.username}
          url="starwatcher.jpg"
        >
          <UnbanButton userID={userID} chanID={chanID} />
        </ChanContact>
      );
    }
    if (isCreator || isAdm) {
      return (
        <ChanContact
          key={user.userID}
          username={user.username}
          url="starwatcher.jpg"
        >
          <ToggleAdmin toggle={adminSection} userID={userID} chanID={chanID} />
          <KickButton userID={userID} chanID={chanID} />
          <BanButton userID={userID} chanID={chanID} />
        </ChanContact>
      );
    }
    return (
      <ChanContact
        key={user.userID}
        username={user.username}
        url="starwatcher.jpg"
      />
    );
  };

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
