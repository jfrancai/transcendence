import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
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
  chanID: string;
  setChanID: (arg: string) => any;
}

export function ChannelListFeed({ chanID, setChanID }: ContactListProps) {
  const { socket } = useSocketContext();
  const contactList = useUsers(() => setChanID(''));
  const channel = useChanInfo();

  useEffect(() => {
    if (chanID.length !== 0) {
      socket.emit('channelMembers', { chanID });
      socket.emit('channelInfo', { chanID });
    }
  }, [socket, chanID]);

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

  const handleLeave = () => {
    if (chanID.length !== 0) {
      socket.emit('channelLeave', { chanID });
    }
  };

  const handleDelete = () => {
    if (chanID.length !== 0) {
      socket.emit('channelDelete', { chanID });
    }
  };

  const displayButton = () => {
    const handler =
      channel?.creatorID === socket.userID ? handleDelete : handleLeave;
    const label =
      channel?.creatorID === socket.userID ? 'Delete Channel' : 'Leave';
    const disabled =
      contactList.length > 1 && channel?.creatorID === socket.userID;
    return (
      <>
        <button
          onClick={disabled ? () => {} : handler}
          type="button"
          className={`deleteButton mx-2 rounded ${
            disabled
              ? 'bg-pong-blue-800 text-pong-blue-100'
              : 'bg-red-500 text-pong-white hover:bg-red-600'
          } px-4 py-2 shadow `}
        >
          {label}
        </button>
        <Tooltip
          disableStyleInjection
          className={`z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 ${
            !disabled && 'hidden'
          }`}
          anchorSelect=".deleteButton"
          clickable
          place="bottom"
        >
          <p className="font-semibold">The channel needs to be empty</p>
        </Tooltip>
      </>
    );
  };

  const displayCard = (user: Contact) => (
    <ContactCard
      key={user.userID}
      username={user.username}
      userID={user.userID}
      onClick={() => {}}
      url="starwatcher.jpg"
    />
  );
  return (
    <div className="w-full">
      <Scrollable>
        <div className="flex flex-col gap-3">
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
          {contactList.length ? displayButton() : null}
        </div>
      </Scrollable>
    </div>
  );
}
