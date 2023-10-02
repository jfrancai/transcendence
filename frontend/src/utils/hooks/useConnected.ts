import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function useConnected(): boolean {
  const { socket } = useSocketContext();
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  });

  return isConnected;
}
