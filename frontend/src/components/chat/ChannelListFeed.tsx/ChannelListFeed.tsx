import { useEffect } from 'react';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';
import { useChanInfo } from '../../../utils/hooks/useChannelInfo';
import { ContactList } from '../../../utils/hooks/useStatus.interfaces';
import { ChannelList } from '../ChannelList/ChannelList';
import { LeaveChannel } from '../LeaveChannel/LeaveChannel';
import { useChanUsers } from '../../../utils/hooks/useChanUsers';

interface ContactListProps {
  chanID: string;
  setChanID: (arg: string) => any;
}

export function ChannelListFeed({ chanID, setChanID }: ContactListProps) {
  const { socket } = useSocketContext();
  const contactList = useChanUsers(() => setChanID(''));
  const channel = useChanInfo();
  const isCreator = (userID: string) => channel?.creatorID === userID;
  const isAdmin = (userID: string) => {
    if (channel && !isCreator(userID)) {
      return channel.chanAdmins.includes(userID);
    }
    return false;
  };
  const isMember = (userID: string) => {
    if (!isCreator(userID) && !isAdmin(userID)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (chanID.length !== 0) {
      socket.emit('channelMembers', { chanID });
      socket.emit('channelInfo', { chanID });
    }
  }, [socket, chanID]);

  const offline: ContactList = contactList.filter((c) => !c.connected);
  const online: ContactList = contactList.filter((c) => c.connected);

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
          <ChannelList
            list={online.filter((c) => isCreator(c.userID))}
            title="CREATOR"
            chanID={channel ? channel.chanID : ''}
            isAdmin={false}
            isCreator={false}
          />
          <ChannelList
            list={online.filter((c) => isAdmin(c.userID))}
            title="ADMINS"
            chanID={channel ? channel.chanID : ''}
            isAdmin={false}
            isCreator={isCreator(socket.userID)}
            adminSection
          />
          <ChannelList
            list={online.filter((c) => isMember(c.userID))}
            title="ONLINE"
            chanID={channel ? channel.chanID : ''}
            isAdmin={isAdmin(socket.userID)}
            isCreator={isCreator(socket.userID)}
          />
          <ChannelList
            list={offline}
            title="OFFLINE"
            chanID={channel ? channel.chanID : ''}
            isAdmin={isAdmin(socket.userID)}
            isCreator={isCreator(socket.userID)}
          />
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
