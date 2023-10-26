import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export type Status =
  | 'CLASSIC_INIT_READY'
  | 'CLASSIC_INIT_END'
  | 'CLASSIC_INIT_MATCH'
  | 'CLASSIC_MODE'
  | 'default'
  | 'SPEED_INIT_READY'
  | 'SPEED_INIT_END'
  | 'SPEED_INIT_MATCH'
  | 'SPEED_MODE';

export function useConnection(): {
  pongStatus: Status;
} {
  const { socket } = useSocketContext();
  const [pongStatus, setPongStatus] = useState<Status>('default');

  useEffect(() => {
    const onConnection = (status: Status) => {
      setPongStatus(status);
    };

    socket.on('connection', onConnection);
    return () => {
      socket.off('connection', onConnection);
    };
  });

  return { pongStatus };
}
