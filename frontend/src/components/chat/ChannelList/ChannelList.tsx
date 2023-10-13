import { ContactList } from '../../../utils/hooks/useStatus.interfaces';
import { AdminContact } from '../AdminContact';
import { BannedContact } from '../BannedContact';
import { ChanContact } from '../ChanContact/ChanContact';
import { ListHeader } from '../ListHeader';
import { MemberContact } from '../MemberContact';

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

interface BanProps {
  list: ContactList;
  chanID: string;
  displayButtons: boolean;
}

export function Banned({ list, chanID, displayButtons }: BanProps) {
  if (list.length) {
    return (
      <div>
        <ListHeader>banned</ListHeader>
        {list.map((user) => (
          <BannedContact
            key={user.userID}
            username={user.username}
            userID={user.userID}
            chanID={chanID}
            displayButtons={displayButtons}
          />
        ))}
      </div>
    );
  }
  return null;
}
