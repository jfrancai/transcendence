import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export type Status =
  | 'default'
  | 'waitingRoom'
  | 'partyStarted'
  | 'partyNotStarted'
  | 'partyEnded';

export function useConnection(): { pongStatus: Status } {
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
