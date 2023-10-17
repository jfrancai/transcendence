import { useEffect } from 'react';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';
import { useChanInfo } from '../../../utils/hooks/useChannelInfo';
import { Admins, Banned, Creator, Members } from '../ChannelList/ChannelList';
import { LeaveChannel } from '../LeaveChannel/LeaveChannel';
import { useChanUsers } from '../../../utils/hooks/useChanUsers';
import { UpdateChannel } from '../AddPassword/AddPassword';

interface ContactListProps {
  chanID: string;
  setChanID: (arg: string) => any;
  updateChannel: () => any;
  toggleInviteChannel: () => any;
}

export function ChannelListFeed({
  chanID,
  setChanID,
  updateChannel,
  toggleInviteChannel
}: ContactListProps) {
  const { socket } = useSocketContext();
  const { contactList, bannedList } = useChanUsers(() => setChanID(''), chanID);

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
    const emitInfo = () => {
      if (chanID.length !== 0) {
        socket.emit('usersBanned', { chanID });
        socket.emit('channelMembers', { chanID });
        socket.emit('channelInfo', { chanID });
      }
    };
    emitInfo();
    socket.on('channelAddAdmin', emitInfo);
    socket.on('channelRestrict', emitInfo);
    socket.on('channelRemoveAdmin', emitInfo);
    return () => {
      socket.off('channelAddAdmin', emitInfo);
      socket.off('channelRestrict', emitInfo);
      socket.off('channelRemoveAdmin', emitInfo);
    };
  }, [socket, chanID]);
  useEffect(() => {}, [socket]);

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

  const displayButtons = isAdmin(socket.userID) || isCreator(socket.userID);
  return (
    <div className="w-full">
      <Scrollable>
        <div className="flex flex-col gap-3">
          <Creator
            list={contactList.filter((c) => isCreator(c.userID))}
            chanID={chanID}
          />
          <Admins
            list={contactList.filter((c) => isAdmin(c.userID))}
            chanID={channel ? channel.chanID : ''}
            displayButtons={displayButtons}
            userID={socket.userID}
          />
          <Members
            list={contactList.filter((c) => isMember(c.userID))}
            chanID={channel ? channel.chanID : ''}
            displayButtons={displayButtons}
            userID={socket.userID}
          />
          <Banned
            list={bannedList}
            chanID={channel ? channel.chanID : ''}
            displayButtons={displayButtons}
          />
          <UpdateChannel
            display={contactList.length !== 0}
            handler={toggleInviteChannel}
            label="Invite user"
          />
          <UpdateChannel
            display={contactList.length !== 0 && isCreator(socket.userID)}
            handler={updateChannel}
            label="Channel configuration"
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
