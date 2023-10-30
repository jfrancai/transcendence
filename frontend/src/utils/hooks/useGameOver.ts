import { useEffect } from 'react';
import { usePongStateContext } from '../../contexts/pongState';
import { useSocketContext } from '../../contexts/socket';

export function useGameOver() {
  const { socket } = useSocketContext();
  const { END_MATCH } = usePongStateContext();

  useEffect(() => {
    socket.on('gameOver', END_MATCH);

    return () => {
      socket.off('gameOver', END_MATCH);
    };
  }, [socket, END_MATCH]);
}
