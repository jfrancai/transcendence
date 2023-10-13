import { useSocketContext } from '../../../contexts/socket';
import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { AdminContact } from '../AdminContact';
import { BannedContact } from '../BannedContact';
import { ChanContact } from '../ChanContact/ChanContact';
import { ListHeader } from '../ListHeader';
import { MemberContact } from '../MemberContact';

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
    const { userID, username } = user;
    if (isBanned) {
      return (
        <BannedContact userID={userID} username={username} chanID={chanID} />
      );
    }
    if (isCreator || isAdm) {
      return (
        <AdminContact
          username={username}
          userID={userID}
          chanID={chanID}
          toggleAdmin={adminSection}
        />
      );
    }
    return (
      <ChanContact key={userID} username={username} url="starwatcher.jpg" />
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

interface CreatorProps {
  list: ContactList;
}

export function Creator({ list }: CreatorProps) {
  if (list.length) {
    return (
      <div>
        <ListHeader>creator</ListHeader>
        {list.map((user) => (
          <ChanContact
            key={user.userID}
            username={user.username}
            url="starwatcher.jpg"
          />
        ))}
      </div>
    );
  }
  return null;
}

interface AdminsProps {
  list: ContactList;
  chanID: string;
  displayButtons: boolean;
  userID: string;
}

export function Admins({ list, chanID, displayButtons, userID }: AdminsProps) {
  if (list.length) {
    return (
      <div>
        <ListHeader>admins</ListHeader>
        {list.map((user) => (
          <AdminContact
            key={user.userID}
            username={user.username}
            userID={user.userID}
            chanID={chanID}
            displayButtons={displayButtons && user.userID !== userID}
          />
        ))}
      </div>
    );
  }
  return null;
}

interface MembersProps {
  list: ContactList;
  chanID: string;
  displayButtons: boolean;
  userID: string;
}

export function Members({
  list,
  chanID,
  displayButtons,
  userID
}: MembersProps) {
  if (list.length) {
    return (
      <div>
        <ListHeader>members</ListHeader>
        {list.map((user) => (
          <MemberContact
            key={user.userID}
            username={user.username}
            userID={user.userID}
            chanID={chanID}
            displayButtons={displayButtons && user.userID !== userID}
          />
        ))}
      </div>
    );
  }
  return null;
}
