import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { usePongStateContext } from '../../contexts/pongState';

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

export function useConnection() {
  const { socket } = useSocketContext();
  const { send } = usePongStateContext();

  useEffect(() => {
    const onConnection = (status: Status) => {
      console.log('HERER', status);
      send(status);
    };

    socket.on('connection', onConnection);
    return () => {
      socket.off('connection', onConnection);
    };
  });
}
