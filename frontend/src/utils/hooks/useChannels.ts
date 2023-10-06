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

    const onChannels = (data: Channel[]) => {
      const id = !chanID ? data[0].chanID : chanID;
      callBack(id);
      setChannels(data);
    };

    socket.on('channelCreate', onChannelCreate);
    socket.on('channels', onChannels);
    return () => {
      socket.off('channelCreate', onChannelCreate);
      socket.off('channels', onChannels);
    };
  }, [socket, callBack, chanID]);

  return channels;
}
