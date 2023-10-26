import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';
import { useConnection } from './useConnection';

export function useGameStarted(): { isGameStarted: boolean } {
  const { socket } = useSocketContext();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { isGameOver } = useGameOver();
  const { pongStatus } = useConnection();

  useEffect(() => {
    if (pongStatus === 'partyStarted') {
      setIsGameStarted(true);
    } else {
      setIsGameStarted(false);
    }
  }, [pongStatus]);

  useEffect(() => {
    if (isGameOver) {
      setIsGameStarted(false);
    }
  }, [isGameOver]);

  useEffect(() => {
    const onStartGame = () => {
      setIsGameStarted(true);
    };
    socket.on('startGame', onStartGame);

    return () => {
      socket.off('startGame', onStartGame);
    };
  }, [socket]);
  return { isGameStarted };
}
