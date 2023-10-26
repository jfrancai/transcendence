import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';
import { useConnection } from './useConnection';

export function useJoinParty(): { hasJoinParty: boolean } {
  const { socket } = useSocketContext();
  const [hasJoinParty, setHasJoinParty] = useState(false);
  const { isGameOver } = useGameOver();
  const { pongStatus } = useConnection();

  useEffect(() => {
    if (pongStatus === 'partyNotStarted') {
      setHasJoinParty(true);
    } else {
      setHasJoinParty(false);
    }
  }, [pongStatus]);

  useEffect(() => {
    setHasJoinParty(false);
  }, [isGameOver]);

  useEffect(() => {
    const onJoinParty = () => {
      setHasJoinParty(true);
    };

    socket.on('joinParty', onJoinParty);
    return () => {
      socket.off('joinParty', onJoinParty);
    };
  }, [socket]);
  return { hasJoinParty };
}
