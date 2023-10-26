import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useConnection } from './useConnection';

export function useGameOver(): { isGameOver: boolean } {
  const { socket } = useSocketContext();
  const [isGameOver, setIsGameOver] = useState(false);
  const { pongStatus } = useConnection();

  useEffect(() => {
    if (pongStatus === 'partyEnded') {
      setIsGameOver(true);
    } else {
      setIsGameOver(false);
    }
  }, [pongStatus]);

  useEffect(() => {
    const onGameOver = () => {
      setIsGameOver(true);
    };

    const onPlayAgain = () => {
      setIsGameOver(false);
    };

    socket.on('gameOver', onGameOver);
    socket.on('playAgain', onPlayAgain);

    return () => {
      socket.off('gameOver', onGameOver);
      socket.off('playAgain', onPlayAgain);
    };
  }, [socket]);

  return { isGameOver };
}
