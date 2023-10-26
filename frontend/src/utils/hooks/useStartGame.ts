import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { usePongStateContext } from '../../contexts/pongState';

export function useGameStarted() {
  const { socket } = useSocketContext();
  const { START_MATCH } = usePongStateContext();

  useEffect(() => {
    socket.on('startGame', START_MATCH);

    return () => {
      socket.off('startGame', START_MATCH);
    };
  }, [socket, START_MATCH]);
}
