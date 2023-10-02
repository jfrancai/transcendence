import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function useConnected(
  handleOnConnect: (isConnected: boolean) => any = () => {},
  handlOnDisconnect: (isConnected: boolean) => any = () => {}
): boolean {
  const { socket } = useSocketContext();
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const onConnect = () => {
      handleOnConnect(true);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      handlOnDisconnect(false);
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket, handlOnDisconnect, handleOnConnect]);

  return isConnected;
}
