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
      if (!chanID) {
        id = data.length ? data[0].chanID : '';
      } else {
        id = chanID;
      }
      callBack(id);
      setChannels(data);
    };

    socket.on('channelCreate', onChannelCreate);
    socket.on('channelLeave', onChannelLeave);
    socket.on('channels', onChannels);
    return () => {
      socket.off('channelCreate', onChannelCreate);
      socket.off('channelLeave', onChannelLeave);
      socket.off('channels', onChannels);
    };
  }, [socket, callBack, chanID]);

  return channels;
}
