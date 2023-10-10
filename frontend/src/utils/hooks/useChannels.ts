import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Channel } from './useStatus.interfaces';

export function useChannels(callBack: (chanID: string) => any, chanID: string) {
  const { socket } = useSocketContext();
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const onChannelCreate = (data: Channel) => {
      setChannels((c) => c.concat(data));
    };

    const onChannelLeave = (data: { chanID: string; userID: string }) => {
      if (data.userID === socket.userID) {
        setChannels((list) => list.filter((c) => c.chanID !== data.chanID));
      }
    };

    const onChannels = (data: Channel[]) => {
      let id = '';
      if (!chanID || !data.some((c) => c.chanID === chanID)) {
        id = data.length ? data[0].chanID : '';
      } else {
        id = chanID;
      }
      callBack(id);
      setChannels(data);
    };

    const updateChannels = () => {
      socket.emit('channels');
    };

    socket.on('channelCreate', onChannelCreate);
    socket.on('channelLeave', onChannelLeave);
    socket.on('channelDelete', onChannelLeave);
    socket.on('channelRestrict', updateChannels);
    socket.on('channelLeave', updateChannels);
    socket.on('channelDelete', updateChannels);
    socket.on('channels', onChannels);
    return () => {
      socket.off('channelCreate', onChannelCreate);
      socket.off('channelLeave', onChannelLeave);
      socket.off('channelRestrict', updateChannels);
      socket.off('channelLeave', updateChannels);
      socket.off('channelDelete', updateChannels);
      socket.off('channelDelete', onChannelLeave);
      socket.off('channels', onChannels);
    };
  }, [socket, callBack, chanID]);

  return channels;
}
