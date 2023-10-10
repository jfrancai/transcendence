import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { Channel } from './useStatus.interfaces';

export function useChanInfo(): Channel | undefined {
  const { socket } = useSocketContext();
  const [chanInfo, setChanInfo] = useState<Channel | undefined>(undefined);

  useEffect(() => {
    const onChannelInfo = (data: Channel) => {
      setChanInfo(data);
    };
    socket.on('channelInfo', onChannelInfo);
    return () => {
      socket.off('channelInfo', onChannelInfo);
    };
  }, [socket]);

  return chanInfo;
}
