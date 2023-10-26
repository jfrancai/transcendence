import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';
import { useConnection } from './useConnection';

export function usePlayerReady(): { isPlayerReady: boolean } {
  const { socket } = useSocketContext();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { isGameOver } = useGameOver();
  const { pongStatus } = useConnection();

  useEffect(() => {
    if (pongStatus === 'partyNotStarted') {
      socket.emit('isPlayerReady');
      socket.emit('initialState');
    }
  }, [socket, pongStatus]);

  useEffect(() => {
    setIsPlayerReady(false);
  }, [isGameOver]);

  useEffect(() => {
    const onP1Ready = (ready: boolean) => {
      setIsPlayerReady(ready);
    };

    socket.on('playerReady', onP1Ready);
    socket.on('isPlayerReady', onP1Ready);

    return () => {
      socket.off('playerReady', onP1Ready);
      socket.off('isPlayerReady', onP1Ready);
    };
  });
  return { isPlayerReady };
}
