import { useEffect } from 'react';
import { useUsers } from '../../../utils/hooks/useUsers';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';
import { useChanInfo } from '../../../utils/hooks/useChannelInfo';
import { ContactList } from '../../../utils/hooks/useStatus.interfaces';
import { ChannelList } from '../ChannelList/ChannelList';
import { LeaveChannel } from '../LeaveChannel/LeaveChannel';

interface ContactListProps {
  chanID: string;
  setChanID: (arg: string) => any;
}

export function ChannelListFeed({ chanID, setChanID }: ContactListProps) {
  const { socket } = useSocketContext();
  const contactList = useUsers(() => setChanID(''));
  const channel = useChanInfo();
  const isCreator = (userID: string) => channel?.creatorID === userID;

  useEffect(() => {
    if (chanID.length !== 0) {
      socket.emit('channelMembers', { chanID });
      socket.emit('channelInfo', { chanID });
    }
  }, [socket, chanID]);

  const creator: ContactList = [];
  const admins: ContactList = [];
  const members: ContactList = [];
  const offline: ContactList = contactList.filter((c) => !c.connected);
  const online: ContactList = contactList.filter((c) => c.connected);

  online.forEach((user) => {
    if (isCreator(user.userID)) {
      creator.push(user);
    } else if (channel?.chanAdmins.find((a) => a === user.userID)) {
      admins.push(user);
    } else {
      members.push(user);
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
  return (
    <div className="w-full">
      <Scrollable>
        <div className="flex flex-col gap-3">
          <ChannelList list={creator} title="CREATOR" />
          <ChannelList list={admins} title="ADMINS" />
          <ChannelList list={members} title="ONLINE" />
          <ChannelList list={offline} title="OFFLINE" />
          <LeaveChannel
            display={contactList.length !== 0}
            handler={isCreator(socket.userID) ? handleDelete : handleLeave}
            label={isCreator(socket.userID) ? 'Delete channel' : 'Leave'}
            disabled={contactList.length > 1 && isCreator(socket.userID)}
          />
        </div>
      </Scrollable>
    </div>
  );
}
