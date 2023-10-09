import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { ChanContact } from '../ChanContact/ChanContact';

interface ChannelListProps {
  list: ContactList;
  title: string;
}

export function ChannelList({ list, title }: ChannelListProps) {
  const displayCard = (user: Contact) => (
    <ChanContact
      key={user.userID}
      username={user.username}
      userID={user.userID}
      onClick={() => {}}
      url="starwatcher.jpg"
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
